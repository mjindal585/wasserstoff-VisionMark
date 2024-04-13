import { Router } from 'express';
import { userRouter, imageRouter } from './controllers';

const mainRouter = Router();

mainRouter.use('/image', imageRouter);
mainRouter.use('/user', userRouter);

export default mainRouter;
