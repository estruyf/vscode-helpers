import { ExtensionContext, ExtensionMode, extensions } from "vscode";

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
    const usedVersion = this.ctx.globalState.get<string>(`${pkgJson.name}:version`);

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
}