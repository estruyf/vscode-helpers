# Changelog

## [1.2.0] 2025-07-31

- Added theme utilities: `getThemes` and `getTheme` to retrieve and parse VS Code themes contributed by installed extensions.
- Introduced `Theme` interface for theme objects.
- Extended `EditorHelper` with file reading, writing, and existence checking methods.
- Added `bringToFront` utility to bring a workspace folder to the front in VS Code.
- Added `parseWinPath` utility to normalize Windows-style paths.
- Added `ExtensionInfo` class for extension metadata, state, and configuration management.

## [1.1.0] 2022-11-14

- Implementation of the message handler for async/await responses

## [1.0.0] 2022-05-13

- Changed the `EventData` interface data property to `payload`
- `data` property changed to `payload` for sending events

## [0.0.3] 2022-03-23

- Added webview `getState` and `setState` methods
- Added extension service

## [0.0.2] 2021-09-08

- Added remove listener method

## [0.0.1] 2021-09-06

- Initial release including `configuration`, `editor`, `webview` helpers.
