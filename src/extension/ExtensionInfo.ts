import {
  ConfigurationTarget,
  ExtensionContext,
  ExtensionMode,
  extensions,
  SecretStorage,
  workspace,
} from "vscode";

export class ExtensionInfo {
  private static instance: ExtensionInfo;

  private constructor(private ctx: ExtensionContext) {}

  /**
   * Creates the singleton instance for the panel
   * @param extPath
   */
  public static getInstance(ctx?: ExtensionContext): ExtensionInfo {
    if (!ExtensionInfo.instance && ctx) {
      ExtensionInfo.instance = new ExtensionInfo(ctx);
    }

    return ExtensionInfo.instance;
  }

  /**
   * Check if the current version was updated
   * @returns
   */
  public isUpdated(): boolean {
    const pkgJson = this.getPackageJson();
    const installedVersion = pkgJson.version;
    const usedVersion = this.ctx.globalState.get<string>(
      `${pkgJson.name}:version`
    );

    return usedVersion !== installedVersion;
  }

  /**
   * Update the used version of the extension
   */
  public updateVersion() {
    const pkgJson = this.getPackageJson();
    this.ctx.globalState.update(`${pkgJson.name}:version`, pkgJson.version);
  }

  /**
   * Get the currently used version of the extension
   * @returns
   */
  public getUsedVersion(): string | undefined {
    const pkgJson = this.getPackageJson();
    return this.ctx.globalState.get<string>(`${pkgJson.name}:version`);
  }

  /**
   * Gets the current extension context.
   *
   * @returns The {@link ExtensionContext} associated with this extension.
   */
  public get context(): ExtensionContext {
    return this.ctx;
  }

  /**
   * Get the currently installed version of the extension
   * @returns
   */
  public getInstalledVersion(): string {
    const pkgJson = this.getPackageJson();
    return pkgJson.version;
  }

  /**
   * Retrieve the package JSON file of the extension
   * @returns
   */
  public getPackageJson() {
    return this.ctx.extension.packageJSON;
  }

  /**
   * Get the name of the extension
   */
  public get name(): string {
    return this.ctx.extension.packageJSON.name;
  }

  /**
   * Get the name of the extension
   */
  public get displayName(): string {
    return this.ctx.extension.packageJSON.displayName;
  }

  /**
   * Returns the extension's version
   */
  public get version(): string {
    return this.ctx.extension.packageJSON.version;
  }

  /**
   * Check if the extension is in production/development mode
   */
  public get isProductionMode(): boolean {
    return this.ctx.extensionMode === ExtensionMode.Production;
  }

  /**
   * Get the extension's subscriptions
   */
  public get subscriptions(): { dispose(): any }[] {
    return this.ctx.subscriptions;
  }

  /**
   * Get the extension's secrets
   */
  public get secrets(): SecretStorage {
    return this.ctx.secrets;
  }

  /**
   * Get the extension's path
   */
  public get extensionPath(): string {
    return this.ctx.extensionPath;
  }

  /**
   * Gets the workspace folder.
   * @returns The first workspace folder or null if no workspace folders are available.
   */
  public get workspaceFolder() {
    const folders = workspace.workspaceFolders;
    if (!folders) {
      return null;
    }

    return folders[0];
  }

  /**
   * Retrieves the value associated with the specified key from the workspace state.
   * @param key - The key of the value to retrieve.
   * @returns The value associated with the specified key, or undefined if the key does not exist.
   */
  public getState<T>(key: string): T | undefined {
    return this.ctx.workspaceState.get(key);
  }

  /**
   * Sets the state of a key-value pair in the workspace state.
   * @param key - The key of the state.
   * @param value - The value to set for the state.
   * @returns A promise that resolves when the state is updated.
   */
  public async setState(key: string, value: any) {
    return await this.ctx.workspaceState.update(key, value);
  }
}
