import { v4 } from 'uuid';
import { EventData } from '../../models';
import { Messenger } from './Messenger';

class MessageHandler {
  private static instance: MessageHandler;
  private static listeners: { [commandId: string]: Function } = {};

  private constructor() {
    Messenger.listen((message: MessageEvent<EventData<any>>) => {
      const { command, payload } = message.data;

      if (MessageHandler.listeners[command]) {
        MessageHandler.listeners[command](payload);
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
    const commandId = v4();

    return new Promise((resolve, reject) => {
      MessageHandler.listeners[commandId] = (payload: T) => {
        resolve(payload);

        if (MessageHandler.listeners[commandId]) {
          delete MessageHandler.listeners[commandId];
        }
      };

      Messenger.send(message, {
        COMMAND_ID: commandId,
        DATA: payload
      });
    });
  }
}

export const messageHandler = MessageHandler.getInstance();