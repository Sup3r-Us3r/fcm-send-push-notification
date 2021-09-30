# FCM Send Push Notification

To start server:

  * Install dependencies with `yarn install` or `npm install`
  * Start api with `yarn dev` or `npm run dev`

### Base URL

Access by [`localhost:3333`](http://localhost:3333)

### Endpoints

| METHOD | URL | DESCRIPTION
|---|---|---|
| `POST` | `/firebase/sendNotification` | Send a new push notification to topic or specific device |

```json
{
	"title": "Test Node.js API title",
	"body": "Test Node.js API body",
	"imageUrl": "imageUrl here",
  // Send to topic
	"sendToTopic": "topic_example",
  // Send to specific device
  "sendToSpecificDeviceToken": "token_device_here"
}
```

> Choose between **sendToTopic** or **sendToSpecificDeviceToken** and send just what you choose

---

| METHOD | URL | DESCRIPTION
|---|---|---|
| `POST` | `/firebase/createSubscribeToTopic` | Create subscribe to topic from one or more devices |

```json
{
	"registrationTokens": ["token_device_1", "token_device_2"],
	"topic": "topic_example",
}
```

> **registrationTokens** accept string with device token or array from device token

---

| METHOD | URL | DESCRIPTION
|---|---|---|
| `POST` | `/firebase/unsubscribeToTopic` | Unsubscribe to topic from one or more devices |

```json
{
	"registrationTokens": ["token_device_1", "token_device_2"],
	"topic": "topic_example",
}
```

> **registrationTokens** accept string with device token or array from device token

