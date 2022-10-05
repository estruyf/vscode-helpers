import { v4 } from 'uuid';
import { EventData, MessageHandlerData } from '../../models';
import { Messenger } from './Messenger';

class MessageHandler {
  private static instance: MessageHandler;
  private static listeners: { [commandId: string]: Function } = {};

  private constructor() {
    Messenger.listen((message: MessageEvent<MessageHandlerData<any>>) => {
      const { requestId, payload } = message.data;

      if (requestId && MessageHandler.listeners[requestId]) {
        MessageHandler.listeners[requestId](payload);
      }
    });
  }

  /**
   * Get the instance of the message handler
   */
  public static getInstance() {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }

    return MessageHandler.instance;
  }

  /**
   * Send message to the extension layer
   * @param message 
   * @param payload 
   */
  public send(message: string, payload?: any): void {
    Messenger.send(message, payload);
  }

  /**
   * Request data from the extension layer
   * @param message 
   * @param payload 
   * @returns 
   */
  public request<T>(message: string, payload?: any): Promise<T> {
    const requestId = v4();

    return new Promise((resolve, reject) => {
      MessageHandler.listeners[requestId] = (payload: T) => {
        resolve(payload);

        if (MessageHandler.listeners[requestId]) {
          delete MessageHandler.listeners[requestId];
        }
      };

      Messenger.sendWithReqId(message, requestId, payload);
    });
  }
}

export const messageHandler = MessageHandler.getInstance();