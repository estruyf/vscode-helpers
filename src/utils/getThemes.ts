import { EditorHelper } from "./../editor/EditorHelper";
import { extensions, Uri, workspace } from "vscode";
import { Theme } from "../models";

/**
 * Retrieves all themes contributed by installed extensions.
 *
 * This function filters the available extensions to find those that contribute themes,
 * then collects and returns all theme definitions from those extensions.
 *
 * @returns {Theme[]} An array of theme objects.
 */
export const getThemes = (): Theme[] => {
  const themes: Theme[] = [];
  const allExtensions = extensions.all.filter((e) => {
    const pkg = e.packageJSON;
    return (
      pkg.contributes &&
      pkg.contributes.themes &&
      pkg.contributes.themes.length > 0
    );
  });

  for (const ext of allExtensions) {
    const pkg = ext.packageJSON;
    for (const theme of pkg.contributes.themes) {
      themes.push(theme);
    }
  }

  return themes;
};

/**
 * Retrieves and parses a VS Code theme by its name or the currently active theme if no name is provided.
 *
 * This function searches through all installed theme extensions to find the theme matching the given name or the active color theme.
 * It reads the theme file, parses its contents, and returns the theme object. If the theme includes another file via the `include` property,
 * it merges the included file's contents into the returned theme object.
 *
 * @param themeName - The name or ID of the theme to retrieve. If omitted or empty, the currently active color theme is used.
 * @returns A promise that resolves to the parsed theme object.
 * @throws If the theme extension or theme file cannot be found.
 */
export const getTheme = async (themeName?: string) => {
  let crntTheme = workspace
    .getConfiguration("workbench")
    .get("colorTheme") as string;

  // Get all the theme extensions
  const allExtensions = extensions.all.filter((e) => {
    const pkg = e.packageJSON;
    return (
      pkg.contributes &&
      pkg.contributes.themes &&
      pkg.contributes.themes.length > 0
    );
  });

  themeName = !themeName || themeName === "" ? crntTheme : themeName;

  // Get the theme extension that matches the active theme
  const themeExtension = allExtensions.find((e) => {
    const pkg = e.packageJSON;
    return pkg.contributes.themes.find(
      (theme: Theme) => theme.label === themeName || theme.id === themeName
    );
  });

  if (!themeExtension) {
    throw new Error(`Could not find theme extension for ${themeName}`);
  }

  // Get the theme file
  const themeFile: Theme = themeExtension.packageJSON.contributes.themes.find(
    (theme: Theme) => theme.label === themeName || theme.id === themeName
  );

  const themePath = Uri.joinPath(themeExtension.extensionUri, themeFile.path);
  const fileContents = await EditorHelper.readFile(themePath);

  const theme = JSON.parse(fileContents);
  if (!theme) {
    throw new Error(`Could not find theme file for ${themeName}`);
  }

  if (theme.include) {
    const includePath = Uri.joinPath(themePath, "..", theme.include);
    const includeContents = await EditorHelper.readFile(includePath);
    return { ...theme, ...JSON.parse(includeContents) };
  }

  return theme;
};
