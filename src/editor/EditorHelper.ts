import { Uri, workspace, window } from "vscode";


export class EditorHelper {
  
  /**
   * Show a file in the editor
   * @param filePath 
   */
  public static async showFile(filePath: Uri | string): Promise<void> {
    if (filePath) {
      try {
        filePath = typeof filePath === 'string' ? Uri.file(filePath) : filePath;
        const doc = await workspace.openTextDocument(filePath);
        await window.showTextDocument(doc, 1, false);
      } catch (e) {
        throw e;
      }
    }
  }
}