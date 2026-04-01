import { EmailRequiredError } from "@/modules/auth/domain/errors/email-required.error";
import { InvalidEmailError } from "@/modules/auth/domain/errors/invalid-email.error";

export class Email {
    constructor(public readonly value: string) { }
    static create(value: string) {
        const normalized = value.toLowerCase().trim();
        if (!normalized) throw new EmailRequiredError();
        if (!normalized.includes("@")) throw new InvalidEmailError();
        return new Email(normalized);
    }
}
