import { Router } from 'express';
import Controller from './Controller';
import validation from './validation';
import validationHandler from '../../libs/validationHandler';
import authMiddleware from '../../libs/routes/authMiddleWare';

const userRoute: Router = Router();

userRoute.route('/')
    .delete(authMiddleware('userRoutes', 'delete'), validationHandler(validation.delete), Controller.remove);

userRoute.post('/create', authMiddleware('userRoutes', 'create'), validationHandler(validation.create), Controller.create);
userRoute.post('/login', validationHandler(validation.login), Controller.login);
userRoute.get('/me', authMiddleware('userRoutes', 'readToken'), validationHandler(validation.get), Controller.me);
userRoute.get('/getall', authMiddleware('userRoutes', 'read'), validationHandler(validation.get), Controller.getAll);

userRoute.put('/update', authMiddleware('userRoutes', 'update'), validationHandler(validation.update), Controller.update);
userRoute.delete('/remove/:id', authMiddleware('userRoutes', 'delete'), validationHandler(validation.delete), Controller.remove);

export default userRoute;
