import { exec } from "child_process";
import { Uri } from "vscode";

/**
 * Brings the specified workspace folder to the front in Visual Studio Code by executing the `code .` command
 * in the folder's path. This function returns a promise that resolves once the command has been executed.
 *
 * @param workspaceFolderUri - The URI of the workspace folder to bring to the front.
 * @returns A promise that resolves when the operation is complete.
 */
export const bringToFront = (workspaceFolderUri: Uri) => {
  return new Promise<void>((resolve) => {
    if (!workspaceFolderUri) {
      return;
    }
    exec(`code .`, { cwd: workspaceFolderUri.fsPath }, () => {
      resolve();
    });
  });
};
