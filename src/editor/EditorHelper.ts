import { Uri, workspace, window } from "vscode";
import { parseWinPath } from "../utils";

export class EditorHelper {
  /**
   * Opens the specified file in the editor.
   *
   * If a string path is provided, it is converted to a `Uri`. The file is then opened as a text document
   * and displayed in the editor in the first column.
   *
   * @param filePath - The path or `Uri` of the file to open.
   * @returns A promise that resolves when the file has been shown in the editor.
   * @throws If the file cannot be opened or displayed.
   */
  public static async showFile(filePath: Uri | string): Promise<void> {
    if (filePath) {
      try {
        filePath = typeof filePath === "string" ? Uri.file(filePath) : filePath;
        const doc = await workspace.openTextDocument(filePath);
        await window.showTextDocument(doc, 1, false);
      } catch (e) {
        throw e;
      }
    }
  }

  /**
   * Reads the content of a file at the specified URI.
   * Converts Windows-style paths to a normalized format before reading.
   *
   * @param filePath - The URI of the file to read.
   * @returns A promise that resolves with the file's text content.
   */
  public static async readFile(filePath: Uri): Promise<string> {
    const parsedPath = parseWinPath(filePath.fsPath);
    filePath = Uri.file(parsedPath);
    const text = await workspace.fs.readFile(filePath);
    return new TextDecoder().decode(text);
  }

  /**
   * Writes the provided text content to a file at the specified URI.
   * Converts Windows-style paths to a normalized format and replaces escaped newline characters (`\\n`) with actual newlines.
   *
   * @param filePath - The URI of the file to write to.
   * @param text - The text content to write into the file.
   * @returns A promise that resolves when the file has been written.
   */
  public static async writeFile(filePath: Uri, text: string): Promise<void> {
    const parsedPath = parseWinPath(filePath.fsPath);
    filePath = Uri.file(parsedPath);
    await workspace.fs.writeFile(
      filePath,
      new TextEncoder().encode(text.replace(/\\n/g, "\n"))
    );
  }

  /**
   * Checks if a file exists at the specified URI.
   *
   * @param filePath - The URI of the file to check.
   * @returns A promise that resolves to `true` if the file exists, otherwise `false`.
   */
  public static async fileExists(filePath: Uri): Promise<boolean> {
    try {
      await workspace.fs.stat(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
