import { LoginInput } from "@/modules/auth/application/dto/login.input";
import { PasswordHasher } from "@/modules/auth/application/ports/password-hasher";
import { RefreshTokenHasher } from "@/modules/auth/application/ports/refresh-token-hasher";
import { RefreshTokenRepository } from "@/modules/auth/application/ports/refresh-token.repository";
import { TokenService } from "@/modules/auth/application/ports/token-service";
import { UserRepository } from "@/modules/auth/application/ports/user.repository";
import { InvalidCredentialsError } from "@/modules/auth/domain/errors/invalid-credentials.error";
import { RefreshTokenExpirationPolicy } from "@/modules/auth/domain/services/refresh-token-expiration.policy";
import { UserNotFoundError } from "@/modules/auth/domain/errors/user-not-found.error";
import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { Password } from "@/modules/auth/domain/values-object/password.vo";

type LoginUserOutput = {
    id: number;
    bio: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
};

type LoginSessionOutput = {
    sessionId: string;
    expiresAt: Date;
};

export type LoginOutput = {
    user: LoginUserOutput;
    accessToken: string;
    refreshToken: string;
    session: LoginSessionOutput;
};

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly refreshTokenHasher: RefreshTokenHasher,
        private readonly tokenService: TokenService,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly refreshTokenExpirationPolicy: RefreshTokenExpirationPolicy,
    ) { }

    async execute(input: LoginInput): Promise<LoginOutput> {
        const email = Email.create(input.email);
        const password = Password.create(input.password);

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new UserNotFoundError();

        const isPassword = await this.passwordHasher.compare(password.value, user.password);

        if (!isPassword) throw new InvalidCredentialsError();

        const sessionId = this.refreshTokenHasher.generateSession();

        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken({ userId: user.id, role: user.role, sessionId }),
            this.tokenService.signRefreshToken(),
        ]);

        const hashToken = await this.refreshTokenHasher.hash(refreshToken);
        const expiresAt = this.refreshTokenExpirationPolicy.buildExpiresAt(new Date());
        const refreshSession = await this.refreshTokenRepository.create({
            userId: user.id,
            hashToken,
            expiresAt,
            sessionId,
        });

        return {
            user: {
                id: user.id,
                bio: user.bio,
                avatar: user.avatar,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
            },
            accessToken,
            refreshToken,
            session: {
                sessionId: refreshSession.sessionId,
                expiresAt: refreshSession.expiresAt,
            },
        };
    }
}
