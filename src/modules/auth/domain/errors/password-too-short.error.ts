import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class PasswordTooShortError extends AuthDomainError {
    constructor() {
        super("Password must be at least 6 characters", 400);
    }
}
