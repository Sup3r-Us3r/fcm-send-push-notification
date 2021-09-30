require('dotenv').config();

import * as admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
  serviceAccountId: process.env.FIREBASE_CLIENT_EMAIL,
});

const message = {
  data: {
    score: '850',
    time: '2:45',
    message: 'Mensagem enviada pelo Servidor',
  },
  notification: {
    title: 'Mensagem enviada pelo Servidor',
    body: 'Enviei pelo servidor Node.js',
  },
  token: process.env.FIREBASE_DEVICE_TOKEN,
};

// Send a message to the device corresponding to the provided
// registration token.
app.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
