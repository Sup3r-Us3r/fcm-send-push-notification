import * as admin from 'firebase-admin';

interface Message {
  title: string;
  body: string;
  imageUrl?: string;
}

interface SendMessageOptions {
  sendToSpecificDeviceToken?: string;
  sendToTopic?: string;
}

export class FirebaseClient {
  public firebaseClient = !admin.apps.length
    ? admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
      serviceAccountId: process.env.FIREBASE_CLIENT_EMAIL,
    })
    : admin;

  async subscribeToTopic(registrationTokens: string | string[], topic: string) {
    const response = await this.firebaseClient.messaging()
      .subscribeToTopic(registrationTokens, topic);

    return response;
  }

  async unsubscribeToTopic(registrationTokens: string | string[], topic: string) {
    const response = await this.firebaseClient.messaging()
      .unsubscribeFromTopic(registrationTokens, topic);

    return response;
  }

  async sendNotification(message: Message, options: SendMessageOptions) {
    const messageData = {
      data: {},
      notification: {
        title: message.title,
        body: message.body,
        imageUrl: message.imageUrl,
      },
      android: {
        priority: 'high',
        notification: {
          priority: 'high',
          color: '#009FE3',
        },
      },
      token: options.sendToSpecificDeviceToken
        ? options.sendToSpecificDeviceToken
        : undefined,
      topic: options.sendToTopic
        ? options.sendToTopic
        : undefined,
    } as admin.messaging.Message;

    const response = await this.firebaseClient.messaging().send(messageData);

    return response;
  }
}
