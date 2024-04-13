import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { config } from '../../config';

import hasPermission from '../permissions';
import UserRepository from '../../repositories/user/UserRepository';
import IRequest from './IRequest';

export default (module, permissionType) => (req: IRequest, res: Response, next: NextFunction) => {

    const token = req.header('Authorization');
    let user;

    try {
        user = jwt.verify(token, config.KEY);
        if (!user) {
            throw '';
        }
    } catch (err) {
        next({
            error: 'Unauthorized',
            message: 'Token not found',
            code: 401
        });

    }

    if (user !== undefined) {

        const userRepository = new UserRepository();
        userRepository.findone({ id: user.id })
            .then((userData) => {
                if (!userData) {
                    throw 'Unauthorized';
                }
                else if (!hasPermission(module, userData.role, permissionType)) {
                    next({
                        error: 'Unauthorized',
                        message: 'Permission Denied',
                        code: 403,
                    });
                }
                else {
                    req.query._id = user.id;
                    req.userData = userData;
                    next();
                }
            })
            .catch((err) => {
                res.status(401).send({
                    error: 'Unauthorized',
                    message: 'Token not found',
                    status: 401,
                    timestamp: new Date()
                });
            });
    }
};
