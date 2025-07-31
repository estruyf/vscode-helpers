# Visual Studio Code extension helpers

The `@estruyf/vscode` package contains a couple of helpers to make Visual Studio Code Extension development easier.

## Installation

Using npm

```bash
npm i @estruyf/vscode
```

## Helpers

### Configuration

Configuration helpers to make it easier to fetch a setting of your extension.

```typescript
import { Configuration } from "@estruyf/vscode";

const config = Configuration.get("section");

const mdConfig = Configuration.getForLanguage<string>("markdown");

const setting = Configuration.getSetting<string>("section", "setting");

await Configuration.updateSetting<string>("section", "setting", value);

await Configuration.updateSettingForLanguage<string>(
  "markdown",
  "setting",
  value
);
```

### Editor

```typescript
import { EditorHelper } from "@estruyf/vscode";

// Show a file in the editor
EditorHelper.showFile(filepath);

// Read a file's content
const content = await EditorHelper.readFile(uri);

// Write content to a file
await EditorHelper.writeFile(uri, "Hello World");

// Check if a file exists
const exists = await EditorHelper.fileExists(uri);
```

### Webview

#### Message handler

The `messageHandler` is a helper that makes it easier to send and request data from your extension. It is based on the `postMessage` and `onDidReceiveMessage`, but allows you to use async/await to send and receive data.

The `messageHandler` is can send two types of messages to the extension:

1. `messageHandler.send`: This is a one-way message, where you send data to the extension, but don't expect a response.
2. `messageHandler.request`: This is a two-way message, where you send data to the extension, and expect a response.

All you need to do to use it, is the following:

**Webview**

```typescript
import { messageHandler } from "@estruyf/vscode/dist/client";

// Sends a message with id: "GET_DATA"
messageHandler.request<any>("GET_DATA").then((data: any) => {
  // Do something with the returned data
  console.log(data);
});

// Sends a message with id: "POST_DATA" - no data is expected back
messageHandler.send("POST_DATA", { dummy: "Nothing to report..." });
```

**Extension**

```typescript
import { MessageHandlerData } from "@estruyf/vscode";

panel.webview.onDidReceiveMessage(
  (message) => {
    const { command, requestId, payload } = message;

    if (command === "GET_DATA") {
      // Do something with the payload

      // Send a response back to the webview
      panel.webview.postMessage({
        command,
        requestId, // The requestId is used to identify the response
        payload: `Hello from the extension!`,
      } as MessageHandlerData<string>);
    } else if (command === "POST_DATA") {
      // Do something with the payload
    }
  },
  undefined,
  context.subscriptions
);
```

##### Errors

In case you want to send an error back to the webview, you can use the `error` property instead of the `payload` property and pass in your error data.

**Extension**

```typescript
panel.webview.postMessage({
  command,
  requestId, // The requestId is used to identify the response
  error: `Something went wrong!`,
} as MessageHandlerData<string>);
```

**Webview**

```typescript
messageHandler
  .request<string>("GET_DATA_ERROR")
  .then((msg) => {
    setMessage(msg);
  })
  .catch((err) => {
    setError(err);
  });
```

#### Messenger

The messenger can be used to send messages to your extension or listen to messages coming from your extension.

```typescript
import { Messenger } from "@estruyf/vscode/dist/client";

// Get the VS Code API in your webview
Messenger.getVsCodeAPI();

// Listen to messages from your extension.
const listener = (message: MessageEvent<EventData<T>>) => {
  const event = message.data;
  console.log(event.command, event.payload);
};

Messenger.listen<T>(listener);

// Remove a listener
Messenger.unlisten(listener);

// Send a message to your extension
Messenger.send("command", payload);
```

#### WebviewHelper

```typescript
import { WebviewHelper } from "@estruyf/vscode";

// Generate a random string for your webview
WebviewHelper.getNonce();
```

## License

[MIT License](./LICENSE)

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fvscode-helpers&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fvscode-helpers)
