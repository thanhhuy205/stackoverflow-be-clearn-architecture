import { NextFunction, Request, Response } from 'express';
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    return res.error(err.message || 'Internal server error', err.status || 500);
};