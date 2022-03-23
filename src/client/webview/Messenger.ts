import { WebviewApi } from 'vscode-webview';
import { EventData } from '../../models/EventData';

interface ClientVsCode<T> {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
}

export class Messenger {
  private static vscode: any;

  /**
   * Get the VS Code API in your webview
   * @returns {ClientVsCode<T>}
   */
  public static getVsCodeAPI<T>(): WebviewApi<T> {
    if (!Messenger.vscode) {
      Messenger.vscode = acquireVsCodeApi();
    }
    return Messenger.vscode as WebviewApi<T>;
  }

  /**
   * Listen to the message from your extension
   * @param callback
   */
  public static listen<T>(callback: (event: MessageEvent<EventData<T>>) => void): void {
    window.addEventListener('message', callback);
  }

  /**
   * Remove the listener from the webview
   * @param callback 
   */
  public static unlisten<T>(callback: (event: MessageEvent<EventData<T>>) => void): void {
    window.removeEventListener('message', callback);
  }
  
  /**
   * Send a message from the webview to the extension
   * @param command 
   * @param data 
   */
  public static send(command: string, data?: any): void {
    const vscode = Messenger.getVsCodeAPI();
    if (data) {
      vscode.postMessage({ command, data });
    } else {
      vscode.postMessage({ command });
    }
  }

  /**
   * Get the state of the extension
   * @returns 
   */
  public static getState = () => {    
    const vscode = Messenger.getVsCodeAPI();
    return vscode.getState();
  }

  /**
   * Set the state of the extension
   * @returns 
   */
  public static setState = (data: any) => {    
    const vscode = Messenger.getVsCodeAPI();
    vscode.setState({
      ...data
    });
  }
}