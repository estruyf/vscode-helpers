import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import { Uri, workspace, WorkspaceConfiguration } from 'vscode';

export class TeamSettings {
  private static teamFileName: string | null;
  private static configKey: string | null;
  private static config: WorkspaceConfiguration;
  private static globalConfig: any;
  private static wsFolder: Uri | undefined;

  /**
   * Initialize team settings
   */
  public static init(fileName: string, configKey: string, wsFolder?: Uri): void {
    if (!fileName) {
      throw new Error('Team file name is not defined');
    }

    if (!fileName.endsWith('.json')) {
      throw new Error('Team file name must end with .json');
    }

    if (!configKey) {
      throw new Error('No config key has been defined');
    }

    TeamSettings.teamFileName = fileName;
    TeamSettings.configKey = configKey;
    TeamSettings.wsFolder = wsFolder;

    const fmConfig = TeamSettings.projectConfigPath();
    if (fmConfig && existsSync(fmConfig)) {
      const localConfig = readFileSync(fmConfig, 'utf8');
      TeamSettings.globalConfig = JSON.parse(localConfig);
    } else {
      TeamSettings.globalConfig = undefined;
    }

    TeamSettings.config = workspace.getConfiguration(configKey);

    TeamSettings.onConfigChange((global?: any) => {
      if (global) {
        TeamSettings.globalConfig = Object.assign({}, global);
      } else {
        TeamSettings.config = workspace.getConfiguration(configKey);
      }
    });
  }

  /**
   * Create the team configuration file is it would not exist
   * @param defaultValue 
   */
  public static createIfNotExists(defaultValue?: any): void {
    const fmConfig = TeamSettings.projectConfigPath();
    if (fmConfig && !existsSync(fmConfig)) {
      writeFileSync(fmConfig, defaultValue ? JSON.stringify(defaultValue) : '{}', 'utf8');
    }
  }

  /**
   * Retrieve a setting from global and local config
   */
   public static get<T>(settingKey: string, merging: boolean = false): T | undefined {
    const settingName = `${TeamSettings.configKey}.${settingKey}`;
    const configInpection = TeamSettings.config.inspect<T>(settingKey);

    let setting = undefined;

    // Retrieve from global config
    if (TeamSettings.globalConfig && typeof TeamSettings.globalConfig[settingName] !== "undefined") {
      setting = TeamSettings.globalConfig[settingName];
    }

    // Retrieve local overrides global
    if (configInpection && typeof configInpection.workspaceValue !== "undefined") {
      if (merging && setting && typeof setting === "object") {
        setting = Object.assign([], setting, configInpection.workspaceValue);
      } else {
        setting = configInpection.workspaceValue;
      }
    }

    if (setting === undefined) {
      setting = TeamSettings.config.get(settingKey);
    }

    return setting;
  }

  /**
   * String update config setting
   * @param name 
   * @param value 
   * @param updateGlobal 
   */
  public static async update<T>(settingKey: string, value: T, updateGlobal: boolean = false) {
    const settingName = `${TeamSettings.configKey}.${settingKey}`;
    const fmConfig = TeamSettings.projectConfigPath();

    if (updateGlobal) {
      if (fmConfig && existsSync(fmConfig)) {
        const localConfig = readFileSync(fmConfig, 'utf8');
        TeamSettings.globalConfig = JSON.parse(localConfig);
        TeamSettings.globalConfig[settingName] = value;
        writeFileSync(fmConfig, JSON.stringify(TeamSettings.globalConfig, null, 2), 'utf8');
        return;
      }
    } else {
      await TeamSettings.config.update(settingKey, value);
      return;
    }

    // Fallback to the local settings
    await TeamSettings.config.update(settingKey, value);
  }

  /**
   * Check for config changes on global and local settings
   * @param callback 
   */
   public static onConfigChange(callback: (global?: any) => void) {
    workspace.onDidChangeConfiguration(() => {
      callback();
    });

    workspace.onDidSaveTextDocument(async (e) => {
      const filename = e.uri.fsPath;
      if (TeamSettings.checkProjectConfig(filename)) {
        const file = await workspace.openTextDocument(e.uri);
        if (file) {
          const fileContents = file.getText();
          const json = JSON.parse(fileContents);
          callback(json);
        }
      }
    });

    workspace.onDidDeleteFiles((e) => {
      const needCallback = e?.files.find(f => TeamSettings.checkProjectConfig(f.fsPath));
      if (needCallback) {
        callback();
      }
    });
  }

  /**
   * Check if its the project config
   * @param filePath 
   * @returns 
   */
  private static checkProjectConfig(filePath: string) {
    const fmConfig = TeamSettings.projectConfigPath();
    if (fmConfig && existsSync(fmConfig)) {
      return filePath &&
             TeamSettings.teamFileName &&
             basename(filePath).toLowerCase() === TeamSettings.teamFileName?.toLowerCase() &&
             fmConfig.toLowerCase() === filePath.toLowerCase();
    }

    return false;
  }

  /**
   * Get the project config path
   * @returns 
   */
  private static projectConfigPath() {
    if (!TeamSettings.teamFileName) {
      return undefined;
    }

    if (TeamSettings.wsFolder) {
      return join(TeamSettings.wsFolder.fsPath, TeamSettings.teamFileName);
    }

    const folders = workspace.workspaceFolders;
    if (folders && folders.length > 0) {
      const wsFolder = folders[0].uri;
      return join(wsFolder.fsPath, TeamSettings.teamFileName);
    }

    return undefined;
  }
}