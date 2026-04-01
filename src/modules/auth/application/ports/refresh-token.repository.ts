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

export interface RefreshTokenRepository {
    create(data: CreateRefreshTokenData): Promise<RefreshTokenRecord>;
    findByTokenHash(hashToken: string): Promise<RefreshTokenRecord | null>;
    revokeBySessionId(sessionId: string): Promise<void>;
}
