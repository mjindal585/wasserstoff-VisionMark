import { Router } from 'express';
import { userRouter, imageRouter } from './controllers';

const mainRouter = Router();

mainRouter.use('/images', imageRouter);
mainRouter.use('/users', userRouter);

export default mainRouter;
