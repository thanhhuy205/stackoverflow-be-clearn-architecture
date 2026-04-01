import { RegisterInput } from "@/modules/auth/application/dto/register.input";
import { PasswordHasher } from "@/modules/auth/application/ports/password-hasher";
import { UserRepository } from "@/modules/auth/application/ports/user.repository";
import { EmailAlreadyUsedError } from "@/modules/auth/domain/errors/email-already-used.error";
import { FirstNameRequiredError } from "@/modules/auth/domain/errors/first-name-required.error";
import { LastNameRequiredError } from "@/modules/auth/domain/errors/last-name-required.error";
import { PasswordConfirmationMismatchError } from "@/modules/auth/domain/errors/password-confirmation-mismatch.error";
import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { Password } from "@/modules/auth/domain/values-object/password.vo";


export type RegisterOutput = {
    id: number;
    bio: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
}

export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
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
            firstName, lastName, password: passwordHash
        })
        return {
            id: user.id,
            bio: user.bio,
            avatar: user.avatar,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
        };
    }

}
