import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    next({
        error: 'Not Found',
        status: 404
    });
};
