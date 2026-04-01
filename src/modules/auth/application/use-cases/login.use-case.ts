import { LoginInput } from "@/modules/auth/application/dto/login.input";
import { PasswordHasher } from "@/modules/auth/application/ports/password-hasher";
import { TokenService } from "@/modules/auth/application/ports/token-service";
import { UserRepository } from "@/modules/auth/application/ports/user.repository";
import { InvalidCredentialsError } from "@/modules/auth/domain/errors/invalid-credentials.error";
import { UserNotFoundError } from "@/modules/auth/domain/errors/user-not-found.error";
import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { Password } from "@/modules/auth/domain/values-object/password.vo";

export type LoginOutput = {
    id: number;
    bio: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
}


export class LoginUseCase {
    constructor(private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenService: TokenService,
    ) { }


    async execute(input: LoginInput): Promise<LoginOutput> {
        const email = Email.create(input.email);
        const password = Password.create(input.password);

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new UserNotFoundError();

        const isPassword = await this.passwordHasher.compare(password.value, user.password);

        if (!isPassword) throw new InvalidCredentialsError();
        // const token = await Promise.all([
        //     this.tokenService.signAccessToken({userId : user.id, role :user.role })
        // ])
        return user
    }
}
