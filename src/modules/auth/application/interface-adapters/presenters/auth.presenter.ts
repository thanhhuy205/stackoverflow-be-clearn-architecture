import { LoginOutput } from "@/modules/auth/application/use-cases/login.use-case";
import { RefreshTokenUseCaseOutput } from "@/modules/auth/application/use-cases/refresh-token.use-case";
import { RegisterOutput } from "@/modules/auth/application/use-cases/register.use-case";

export class AuthPresenter {
    presentRegisteredUser(data: RegisterOutput) {
        return {
            user: {
                id: data.user.id,
                bio: data.user.bio ?? "",
                avatar: data.user.avatar ?? "",
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                createdAt: data.user.createdAt,
            },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            session: {
                sessionId: data.session.sessionId,
                expiresAt: data.session.expiresAt,
            },
        };
    }

    presentLoginUser(data: LoginOutput) {
        return {
            user: {
                id: data.user.id,
                bio: data.user.bio ?? "",
                avatar: data.user.avatar ?? "",
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                createdAt: data.user.createdAt,
            },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            session: {
                sessionId: data.session.sessionId,
                expiresAt: data.session.expiresAt,
            },
        };
    }

    presentRefreshToken(data: RefreshTokenUseCaseOutput) {
        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            session: {
                userId: data.session.userId,
                expiresAt: data.session.expiresAt,
                sessionId: data.session.sessionId,
                revoked: data.session.revoked,
                revokedAt: data.session.revokedAt,
                createdAt: data.session.createdAt,
                updatedAt: data.session.updatedAt,
            },
        };
    }
} 
