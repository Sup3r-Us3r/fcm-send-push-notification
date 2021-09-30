import { Router } from 'express';
import firebaseRouter from './firebase.routes';

const routes = Router();

routes.use('/firebase', firebaseRouter);

export default routes;
