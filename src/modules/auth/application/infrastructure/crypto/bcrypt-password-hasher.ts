import { PasswordHasher } from "@/modules/auth/application/ports/password-hasher";
import bcrypt from 'bcrypt';
export class BcryptPasswordHasher implements PasswordHasher {
    constructor(private readonly saltRounds: number = 10) { }

    hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.saltRounds);
    }
}