export type CreateRefreshTokenData = {
    userId: number;
    hashToken: string;
    expiresAt: Date;
    sessionId: string;
};

export type RefreshTokenRecord = {
    userId: number;
    expiresAt: Date;
    hashToken: string;
    sessionId: string;
    revoked: boolean;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type RefreshTokenUserRecord = {
    id: number,
    role: string[]
}

export type RefreshTokenWithUser = RefreshTokenRecord & { user: RefreshTokenUserRecord };

export interface RefreshTokenRepository {
    create(data: CreateRefreshTokenData): Promise<RefreshTokenRecord>;
    findByTokenHash(hashToken: string): Promise<RefreshTokenWithUser | null>;
    revokeBySessionId(sessionId: string): Promise<void>;
    revokeByRefreshToken(refreshToken: string): Promise<void>;
}
