import { config } from "@/config";
import { BcryptHasherToken } from "@/modules/auth/application/infrastructure/crypto/bcrypt-hasher-token";
import { BcryptPasswordHasher } from "@/modules/auth/application/infrastructure/crypto/bcrypt-password-hasher";
import { PrismaRefreshSessionRepository } from "@/modules/auth/application/infrastructure/persistence/prisma-refresh-session.repository";
import { PrismaUserRepository } from "@/modules/auth/application/infrastructure/persistence/prisma-user.repository";
import { JwtTokenService } from "@/modules/auth/application/infrastructure/token/jwt-token.service";
import { AuthController } from "@/modules/auth/application/interface-adapters/http/auth.controller";
import { AuthPresenter } from "@/modules/auth/application/interface-adapters/presenters/auth.presenter";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RefreshTokenUseCase } from "@/modules/auth/application/use-cases/refresh-token.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { RefreshTokenExpirationPolicy } from "@/modules/auth/domain/services/refresh-token-expiration.policy";
import { prisma } from "@/shared/infrastructure/prisma/prisma.client";

export const buildContainer = () => {
    const userRepository = new PrismaUserRepository(prisma);
    const refreshTokenRepository = new PrismaRefreshSessionRepository(prisma);
    const passwordHasher = new BcryptPasswordHasher(10);
    const refreshTokenHasher = new BcryptHasherToken(config.auth.refreshTokenFixedSalt);
    const tokenService = new JwtTokenService(config.auth.accessTokenSecret);
    const refreshTokenExpirationPolicy = new RefreshTokenExpirationPolicy(config.auth.refreshTokenTtlInDays);

    const registerUseCase = new RegisterUseCase(
        userRepository,
        passwordHasher,
        refreshTokenHasher,
        tokenService,
        refreshTokenRepository,
        refreshTokenExpirationPolicy,
    );
    const loginUserCase = new LoginUseCase(
        userRepository,
        passwordHasher,
        refreshTokenHasher,
        tokenService,
        refreshTokenRepository,
        refreshTokenExpirationPolicy,
    );
    const refreshTokenUseCase = new RefreshTokenUseCase(
        refreshTokenRepository,
        refreshTokenHasher,
        tokenService,
        refreshTokenExpirationPolicy,
    );

    const authPresenter = new AuthPresenter();
    const authController = new AuthController(
        registerUseCase,
        loginUserCase,
        refreshTokenUseCase,
        authPresenter,
    );

    return { authController };
};
