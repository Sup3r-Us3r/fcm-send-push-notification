import { Request, Response } from 'express';
import { FirebaseClient } from '../services/firebaseClient';
import { chunk } from '../utils/chunk';

interface SendNotificationBody {
  title: string;
  body: string;
  imageUrl?: string;
  sendToTopic?: string;
  sendToSpecificDeviceToken?: string;
}

interface CreateSubscribeToTopicBody {
  registrationTokens: string | string[];
  topic: string;
}

interface UnsubscribeToTopicBody {
  registrationTokens: string | string[];
  topic: string;
}

export default new class PushNotificationController {
  async createSubscribeToTopic(req: Request, res: Response) {
    const { registrationTokens, topic } = req.body as CreateSubscribeToTopicBody;

    try {
      const response = await new FirebaseClient()
        .subscribeToTopic(registrationTokens, topic);

      if (response.failureCount === 0) {
        return res.json({ message: response });
      }

      if (response.errors.length > 0) {
        return res.status(400).json({ message: response });
      }

      return res.status(500).json({ message: response });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async unsubscribeToTopic(req: Request, res: Response) {
    const { registrationTokens, topic } = req.body as UnsubscribeToTopicBody;

    const tokenChunkInput = Array.isArray(registrationTokens)
      ? registrationTokens
      : [registrationTokens];

    const tokensChunks = chunk(tokenChunkInput, 1000);

    let tokensToUnsubscribePromises: any[] = [];
    let tokensWithErrorList: string[] = [];

    tokensChunks.forEach((chunk: string[]) => {
      tokensToUnsubscribePromises.push(
        new Promise(async (resolve, reject) => {
          try {
            const response = await new FirebaseClient()
              .unsubscribeToTopic(chunk, topic);

            if (response.failureCount === 0) {
              resolve({ message: response });
            }

            if (response.errors.length > 0) {
              const indexOfTokenWithError = response.errors
                .map(error => error.index);

              const tokensWithError = chunk
                .filter((_, index) => indexOfTokenWithError.includes(index));

              const tokensWithErrorResult = [...tokensWithErrorList, ...tokensWithError];

              tokensWithErrorList = tokensWithErrorResult;

              reject({ message: response });
            }

            reject({ message: response });
          } catch (error) {
            reject(error);
          }
        })
      );
    });

    Promise.allSettled(tokensToUnsubscribePromises).then(() => {
      if (tokensWithErrorList.length > 0) {
        const tokensWithErrorChunks = chunk(tokensWithErrorList, 1000);
        tokensToUnsubscribePromises = [];

        tokensWithErrorChunks.forEach((chunk: string[]) => {
          tokensToUnsubscribePromises.push(
            new Promise(async (resolve, reject) => {
              try {
                const response = await new FirebaseClient()
                  .unsubscribeToTopic(chunk, topic);

                resolve({ message: response });
              } catch (error) {
                reject(error);
              }
            })
          );
        });

        Promise.allSettled(tokensToUnsubscribePromises).then(() => {
          return res.json({ message: 'Operation completed' });
        });
      } else {
        return res.json({ message: 'Operation completed' });
      }
    });
  }

  async sendNotification(req: Request, res: Response) {
    const {
      title,
      body,
      imageUrl,
      sendToSpecificDeviceToken,
      sendToTopic,
    } = req.body as SendNotificationBody;

    try {
      const response = await new FirebaseClient()
        .sendNotification(
          { title, body, imageUrl },
          { sendToTopic, sendToSpecificDeviceToken },
        );

      if (response) {
        return res.json({ message: 'Push notification has been sent!' });
      }

      return res.status(400).json({ message: response });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
