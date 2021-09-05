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
import { Messenger } from '@estruyf/vscode';

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

MIT License

Copyright (c) 2021 Elio Struyf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fvscode-helpers&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fvscode-helpers)