# Visual Studio Code extension helpers

The `@estruyf/vscode` package contains a couple of helpers to make Visual Studio Code Extension development easier.

## Installation

Using npm

```bash
npm i @estruyf/vscode
```

Using yarn

```bash
yarn add @estruyf/vscode
```

## Helpers

### Configuration

Configuration helpers to make it easier to fetch a setting of your extension.

```typescript
import { Configuration } from '@estruyf/vscode';

const config = Configuration.get('section');
const mdConfig = Configuration.getForLanguage<string>('markdown');

const setting = Configuration.getSetting<string>('section', 'setting');

await Configuration.updateSetting<string>('section', 'setting', value);
await Configuration.updateSettingForLanguage<string>('markdown', 'setting', value);
```

### Editor

```typescript
import { EditorHelper } from '@estruyf/vscode';

// Show a file in the editor
EditorHelper.showFile(filepath);
```

### Webview

#### Messenger

The messenger can be used to send messages to your extension or listen to messages coming from your extension.

```typescript
import { Messenger } from '@estruyf/vscode/dist/client';

// Get the VS Code API in your webview
Messenger.getVsCodeAPI();

// Listen to messages from your extension
Messenger.listen((message) => {
  console.log(message.command, message.data);
});

// Send a message to your extension
Messenger.send('command', data);
```

#### WebviewHelper

```typescript
import { WebviewHelper } from '@estruyf/vscode';

// Generate a random string for your webview
WebviewHelper.getNonce();
```

## License

[MIT License](./LICENSE)

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fvscode-helpers&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fvscode-helpers)