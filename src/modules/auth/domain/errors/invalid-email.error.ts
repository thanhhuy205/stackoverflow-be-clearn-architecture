import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class InvalidEmailError extends AuthDomainError {
    constructor() {
        super("Email is invalid", 400);
    }
}
