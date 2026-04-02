import { LogoutInput } from "@/modules/auth/application/dto/logout.input";
import { RefreshTokenHasher } from "@/modules/auth/application/ports/refresh-token-hasher";
import { RefreshTokenRepository } from "@/modules/auth/application/ports/refresh-token.repository";

export class LogoutUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly refreshTokenHasher: RefreshTokenHasher
    ) { }

    async execute(input: LogoutInput): Promise<boolean> {
        const hashRefreshToken = await this.refreshTokenHasher.hash(input.refreshToken);

        const refreshTokenRecord = await this.refreshTokenRepository.findByTokenHash(hashRefreshToken);
        if (!refreshTokenRecord) {
            throw new Error("Refresh token not found");
        }

        await this.refreshTokenRepository.revokeByRefreshToken(input.refreshToken);
        return true
    }
}