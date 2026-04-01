import { NextFunction, Request, Response } from "express";

export const requireRefreshTokenMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const refreshToken = req.body?.refreshToken;

    if (typeof refreshToken !== "string" || refreshToken.trim().length === 0) {
        return res.error("refreshToken is required", 400, "BAD_REQUEST");
    }

    next();
};
