import { Router } from 'express';
import Controller from './Controller';
import validation from './validation';
import validationHandler from '../../libs/validationHandler';
import authMiddleware from '../../libs/routes/authMiddleWare';
import { upload } from '../../libs/routes/multer.middleware';

const imageRoute: Router = Router();

imageRoute.route('/')
    .get(authMiddleware('imageRoutes', 'read'), validationHandler(validation.get), Controller.get)

imageRoute.post('/upload', authMiddleware('imageRoutes', 'upload'), upload.single('image'), Controller.upload);
imageRoute.post('/annotate', authMiddleware('imageRoutes', 'annotate'), validationHandler(validation.annotate), Controller.annotate);
imageRoute.post('/approve', authMiddleware('imageRoutes', 'approve'), validationHandler(validation.approve), Controller.approve);
imageRoute.get('/getall', authMiddleware('imageRoutes', 'read'), validationHandler(validation.getAll), Controller.getAll);


export default imageRoute;
