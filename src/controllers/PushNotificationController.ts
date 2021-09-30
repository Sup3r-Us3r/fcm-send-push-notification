import { Request, Response } from 'express';
import { FirebaseClient } from '../services/firebaseClient';

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

    try {
      const response = await new FirebaseClient()
        .unsubscribeToTopic(registrationTokens, topic);

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
          // {​ sendToSpecificDeviceToken: process.env.FIREBASE_DEVICE_TOKEN }​,
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
