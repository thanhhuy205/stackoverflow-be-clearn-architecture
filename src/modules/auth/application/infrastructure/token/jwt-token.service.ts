import { TokenService } from "@/modules/auth/application/ports/token-service";
import { RoleCode } from "@prisma/client";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export class JwtTokenService implements TokenService {
    constructor(
        private readonly accessSecret: string,
    ) { }
    async signAccessToken(payload: { userId: number; role: RoleCode[]; sessionId: string; }): Promise<string> {
        return jwt.sign({ sub: payload.userId, type: 'access', role: payload.role, sessionId: payload.sessionId }, this.accessSecret, { expiresIn: '15m' });
    }
    async signRefreshToken(): Promise<string> {
        return crypto.randomBytes(20).toString('hex');
    }

}