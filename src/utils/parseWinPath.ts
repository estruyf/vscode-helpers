/**
 * Converts a Windows-style file path (using backslashes) to a POSIX-style path (using forward slashes).
 *
 * @param path - The Windows file path to convert. If `undefined`, returns an empty string.
 * @returns The converted path with forward slashes, or an empty string if the input is `undefined`.
 */
export const parseWinPath = (path: string | undefined): string => {
  return path?.split(`\\`).join(`/`) || "";
};
