import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class PasswordConfirmationMismatchError extends AuthDomainError {
    constructor() {
        super("Password must equal confirmPassword", 400);
    }
}
