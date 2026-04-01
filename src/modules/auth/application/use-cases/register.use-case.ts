import { RegisterInput } from "@/modules/auth/application/dto/register.input";
import { PasswordHasher } from "@/modules/auth/application/ports/password-hasher";
import { UserRepository } from "@/modules/auth/application/ports/user.repository";


export type RegisterOutput = {
    id: string;
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
        const email = input.email.trim().toLowerCase();
        const firstName = input.firstName.trim();
        const lastName = input.lastName.trim();
        const password = input.password;

        if (!email) {
            throw new Error('Email is required');
        }

        if (!firstName) {
            throw new Error('firstName is required');
        }

        if (!lastName) {
            throw new Error('firstName is required');
        }

        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const passwordHash = await this.passwordHasher.hash(password);

        const user = await this.userRepository.create({
            email,
            firstName, lastName, password: passwordHash
        })
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
        };
    }

}