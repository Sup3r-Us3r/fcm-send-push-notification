import { Router } from 'express';
import PushNotificationController from '../controllers/PushNotificationController';

const firebaseRouter = Router();

firebaseRouter.post(
  '/createSubscribeToTopic',
  PushNotificationController.createSubscribeToTopic,
);
firebaseRouter.post(
  '/unsubscribeToTopic',
  PushNotificationController.unsubscribeToTopic,
);
firebaseRouter.post(
  '/sendNotification',
  PushNotificationController.sendNotification,
);

export default firebaseRouter;
