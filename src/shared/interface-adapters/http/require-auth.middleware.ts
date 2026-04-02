import { config } from "@/config";
import { AccessTokenPayload } from "@/types/common/auth.type";
import { RoleCode } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const validRoles = new Set<RoleCode>(Object.values(RoleCode));

export const requireAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authorization = req.headers.authorization;

    if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
        return res.error("Authorization token is required", 401, "UNAUTHORIZED");
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
        return res.error("Authorization token is required", 401, "UNAUTHORIZED");
    }

    try {
        const payload = jwt.verify(token, config.auth.accessTokenSecret) as AccessTokenPayload;
        const userId = Number(payload.sub);
        const sessionId = typeof payload.sessionId === "string" ? payload.sessionId : "";
        const roles = Array.isArray(payload.role)
            ? payload.role.reduce<RoleCode[]>((result, role) => {
                if (validRoles.has(role as RoleCode)) {
                    result.push(role as RoleCode);
                }

                return result;
            }, [])
            : [];

        if (payload.type !== "access" || !Number.isInteger(userId) || userId <= 0 || sessionId.length === 0) {
            return res.error("Invalid access token", 401, "UNAUTHORIZED");
        }

        req.user = {
            userId,
            roles,
            sessionId,
        };

        next();
    } catch {
        return res.error("Invalid access token", 401, "UNAUTHORIZED");
    }
};
