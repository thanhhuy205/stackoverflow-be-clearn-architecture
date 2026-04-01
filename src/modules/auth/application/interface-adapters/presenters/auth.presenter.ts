import { LoginOutput } from "@/modules/auth/application/use-cases/login.use-case";
import { RefreshTokenUseCaseOutput } from "@/modules/auth/application/use-cases/refresh-token.use-case";
import { RegisterOutput } from "@/modules/auth/application/use-cases/register.use-case";

export class AuthPresenter {
    presentRegisteredUser(data: RegisterOutput) {
        return {
            id: data.id,
            bio: data.bio ?? "",
            avatar: data.avatar ?? "",
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: data.createdAt,
        };
    }

    presentLoginUser(data: LoginOutput) {
        return {
            id: data.id,
            bio: data.bio ?? "",
            avatar: data.avatar ?? "",
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: data.createdAt,
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
