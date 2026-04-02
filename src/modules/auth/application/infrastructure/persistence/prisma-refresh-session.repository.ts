import {
    CreateRefreshTokenData,
    RefreshTokenRecord,
    RefreshTokenRepository,
    RefreshTokenWithUser,
} from "@/modules/auth/application/ports/refresh-token.repository";
import { PrismaClient, RefreshToken } from "@prisma/client";

export class PrismaRefreshSessionRepository implements RefreshTokenRepository {
    constructor(private readonly prisma: PrismaClient) { }
    

    async create(data: CreateRefreshTokenData): Promise<RefreshTokenRecord> {
        const refreshToken = await this.prisma.refreshToken.create({
            data: {
                userId: data.userId,
                hashToken: data.hashToken,
                expiresAt: data.expiresAt,
                sessionId: data.sessionId,
            },
        });

        return this.toRecord(refreshToken);
    }

    async findByTokenHash(hashToken: string): Promise<RefreshTokenWithUser | null> {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { hashToken },
            include: {
                user: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        });

        if (!refreshToken) return null;

        return {
            userId: refreshToken.userId,
            expiresAt: refreshToken.expiresAt,
            hashToken: refreshToken.hashToken,
            sessionId: refreshToken.sessionId,
            revoked: refreshToken.revoked,
            revokedAt: refreshToken.revokedAt,
            createdAt: refreshToken.createdAt,
            updatedAt: refreshToken.updatedAt,
            user: {
                id: refreshToken.user.id,
                role: refreshToken.user.role
            }
        };
    }

    async revokeBySessionId(sessionId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { sessionId, revoked: false },
            data: {
                revoked: true,
                revokedAt: new Date(),
            },
        });
    }

    async revokeByRefreshToken(refreshToken: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { hashToken: refreshToken, revoked: false },
            data: {
                revoked: true,
                revokedAt: new Date(),
            },
        });
    }

    private toRecord(refreshToken: RefreshToken): RefreshTokenRecord {
        return {
            userId: refreshToken.userId,
            expiresAt: refreshToken.expiresAt,
            hashToken: refreshToken.hashToken,
            sessionId: refreshToken.sessionId,
            revoked: refreshToken.revoked,
            revokedAt: refreshToken.revokedAt,
            createdAt: refreshToken.createdAt,
            updatedAt: refreshToken.updatedAt,
        };
    }


}
