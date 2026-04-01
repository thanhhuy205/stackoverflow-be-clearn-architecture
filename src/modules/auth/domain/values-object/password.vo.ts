import { PasswordTooShortError } from "@/modules/auth/domain/errors/password-too-short.error";

export class Password {
    constructor(public readonly value: string) { }
    static create(value: string) {
        if (!value || value.length < 6) {
            throw new PasswordTooShortError();
        }
        return new Password(value);
    }
}
