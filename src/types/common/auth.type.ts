import { RoleCode } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export type AuthenticatedUser = {
    userId: number;
    roles: RoleCode[];
    sessionId: string;
};

export type AccessTokenPayload = JwtPayload & {
    sub: string | number;
    type?: string;
    role?: RoleCode[] | string[];
    sessionId?: string;
};
