import { RegisterInput } from "@/modules/auth/application/dto/register.input";
import { PasswordHasher } from "@/modules/auth/application/ports/password-hasher";
import { RefreshTokenHasher } from "@/modules/auth/application/ports/refresh-token-hasher";
import { RefreshTokenRepository } from "@/modules/auth/application/ports/refresh-token.repository";
import { TokenService } from "@/modules/auth/application/ports/token-service";
import { UserRepository } from "@/modules/auth/application/ports/user.repository";
import { EmailAlreadyUsedError } from "@/modules/auth/domain/errors/email-already-used.error";
import { FirstNameRequiredError } from "@/modules/auth/domain/errors/first-name-required.error";
import { LastNameRequiredError } from "@/modules/auth/domain/errors/last-name-required.error";
import { PasswordConfirmationMismatchError } from "@/modules/auth/domain/errors/password-confirmation-mismatch.error";
import { RefreshTokenExpirationPolicy } from "@/modules/auth/domain/services/refresh-token-expiration.policy";
import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { Password } from "@/modules/auth/domain/values-object/password.vo";


type RegisterUserOutput = {
    id: number;
    bio: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
};

type RegisterSessionOutput = {
    sessionId: string;
    expiresAt: Date;
};

export type RegisterOutput = {
    user: RegisterUserOutput;
    accessToken: string;
    refreshToken: string;
    session: RegisterSessionOutput;
};

export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly refreshTokenHasher: RefreshTokenHasher,
        private readonly tokenService: TokenService,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly refreshTokenExpirationPolicy: RefreshTokenExpirationPolicy,
    ) { }

    async execute(input: RegisterInput): Promise<RegisterOutput> {
        const email = Email.create(input.email);
        const firstName = input.firstName.trim();
        const lastName = input.lastName.trim();
        const password = Password.create(input.password);
        const confirmPassword = input.confirmPassword;

        if (!firstName) {
            throw new FirstNameRequiredError();
        }

        if (!lastName) {
            throw new LastNameRequiredError();
        }

        if (password.value != confirmPassword) {
            throw new PasswordConfirmationMismatchError();
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new EmailAlreadyUsedError();
        }

        const passwordHash = await this.passwordHasher.hash(password.value);

        const user = await this.userRepository.create({
            email: email,
            firstName,
            lastName,
            password: passwordHash,
        });

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
