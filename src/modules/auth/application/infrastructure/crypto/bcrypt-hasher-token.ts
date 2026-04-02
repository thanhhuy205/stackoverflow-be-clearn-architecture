import { RefreshTokenHasher } from "@/modules/auth/application/ports/refresh-token-hasher";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
const BCRYPT_ROUND_10_SALT_REGEX = /^\$2[aby]\$10\$[./A-Za-z0-9]{22}$/;

export class BcryptHasherToken implements RefreshTokenHasher {
    constructor(private readonly fixedSalt: string) {
        if (!BCRYPT_ROUND_10_SALT_REGEX.test(fixedSalt)) {
            throw new Error("REFRESH_TOKEN_FIXED_SALT must be a valid bcrypt salt with 10 rounds.");
        }
    }
    generateSession(): string {
        return uuidv4();
    }

    hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.fixedSalt);
    }
}
