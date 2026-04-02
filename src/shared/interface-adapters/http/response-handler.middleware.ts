import { NextFunction, Request, Response } from 'express';

export const responseMiddleware = (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.success = function <T>(
        data: T,
        status: number = 200,
        message?: string,
    ) {
        return res.status(status).json({
            success: true,
            ...(message && { message }),
            data,
        });
    };

    res.error = function (
        error: string | Error,
        status: number = 500,
        message?: string,
    ) {
        const errorMessage =
            typeof error === 'string'
                ? error
                : error.message || String(error);

        return res.status(status).json({
            success: false,
            ...(message && { message }),
            error: errorMessage,
        });
    };

    res.pagination = function <T>(
        data: T[],
        pagination: any,
        status: number = 200,
    ) {
        return res.status(status).json({
            success: true,
            data,
            pagination,
        });
    };

    next();
};