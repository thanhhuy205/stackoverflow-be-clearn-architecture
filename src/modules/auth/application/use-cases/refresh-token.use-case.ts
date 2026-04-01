import { RefreshTokenInput } from "@/modules/auth/application/dto/refresh-token.input";
import { RefreshTokenHasher } from "@/modules/auth/application/ports/refresh-token-hasher";
import {
    CreateRefreshTokenData,
    RefreshTokenRecord,
    RefreshTokenRepository,
} from "@/modules/auth/application/ports/refresh-token.repository";
import { TokenService } from "@/modules/auth/application/ports/token-service";
import { RefreshSessionEntity } from "@/modules/auth/domain/entities/refresh-session.entity";
import { RefreshTokenExpiredError } from "@/modules/auth/domain/errors/refresh-token-expired.error";
import { RefreshTokenNotFoundError } from "@/modules/auth/domain/errors/refresh-token-not-found.error";
import { RefreshTokenRevokedError } from "@/modules/auth/domain/errors/refresh-token-revoked.error";
import crypto from "crypto";

export type RefreshTokenOutput = {
    userId: number;
    expiresAt: Date;
    hashToken: string;
    sessionId: string;
    revoked: boolean;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export class RefreshTokenOutputModel {
    constructor(
        public readonly userId: number,
        public readonly expiresAt: Date,
        public readonly hashToken: string,
        public readonly sessionId: string,
        public readonly revoked: boolean,
        public readonly revokedAt: Date | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static fromRecord(record: RefreshTokenRecord): RefreshTokenOutputModel {
        return new RefreshTokenOutputModel(
            record.userId,
            record.expiresAt,
            record.hashToken,
            record.sessionId,
            record.revoked,
            record.revokedAt,
            record.createdAt,
            record.updatedAt,
        );
    }
}

export type RefreshTokenUseCaseOutput = {
    accessToken: string;
    refreshToken: string;
    session: RefreshTokenOutput;
};

export class RefreshTokenUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly refreshTokenHasher: RefreshTokenHasher,
        private readonly tokenService: TokenService,
    ) { }

    async execute(input: RefreshTokenInput): Promise<RefreshTokenUseCaseOutput> {
        const oldTokenHash = await this.refreshTokenHasher.hash(input.refreshToken);
        const oldSessionRecord = await this.refreshTokenRepository.findByTokenHash(oldTokenHash);

        if (!oldSessionRecord) throw new RefreshTokenNotFoundError();

        const oldSession = new RefreshSessionEntity({
            userId: oldSessionRecord.userId,
            expiresAt: oldSessionRecord.expiresAt,
            hashToken: oldSessionRecord.hashToken,
            sessionId: oldSessionRecord.sessionId,
            revoked: oldSessionRecord.revoked,
            revokedAt: oldSessionRecord.revokedAt,
            createdAt: oldSessionRecord.createdAt,
            updatedAt: oldSessionRecord.updatedAt,
        });

        if (oldSession.revoked) throw new RefreshTokenRevokedError();
        if (oldSession.isExpired(new Date())) throw new RefreshTokenExpiredError();

        await this.refreshTokenRepository.revokeBySessionId(oldSession.sessionId);

        const nextRefreshToken = await this.tokenService.signRefreshToken();
        const nextSessionId = crypto.randomUUID();

        const nextHashToken = await this.refreshTokenHasher.hash(nextRefreshToken);
        const nextExpiresAt = this.buildRefreshTokenExpiresAt(new Date());

        const createData: CreateRefreshTokenData = {
            userId: oldSession.userId,
            hashToken: nextHashToken,
            expiresAt: nextExpiresAt,
            sessionId: nextSessionId,
        };

        const nextSessionRecord = await this.refreshTokenRepository.create(createData);

        const accessToken = await this.tokenService.signAccessToken({
            userId: nextSessionRecord.userId,
            role: oldSessionRecord.user.role,
            sessionId: nextSessionRecord.sessionId,
        });

        return {
            accessToken,
            refreshToken: nextRefreshToken,
            session: this.toOutput(nextSessionRecord),
        };
    }

    private buildRefreshTokenExpiresAt(now: Date): Date {
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 7);
        return expiresAt;
    }

    private toOutput(record: RefreshTokenRecord): RefreshTokenOutput {
        const output = RefreshTokenOutputModel.fromRecord(record);

        return {
            userId: output.userId,
            expiresAt: output.expiresAt,
            hashToken: output.hashToken,
            sessionId: output.sessionId,
            revoked: output.revoked,
            revokedAt: output.revokedAt,
            createdAt: output.createdAt,
            updatedAt: output.updatedAt,
        };
    }
}
