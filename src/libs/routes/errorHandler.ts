import { Request, Response, NextFunction } from 'express';

export default (err: IErr, req: Request, res: Response, next: NextFunction) => {

    res.status(err.code).json(
        {
            error: err.error,
            message: err.message || 'error',
            status: err.code,
            timestamp: new Date()
        }
    );
};
