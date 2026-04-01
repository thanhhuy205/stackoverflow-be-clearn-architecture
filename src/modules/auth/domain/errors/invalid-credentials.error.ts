import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class InvalidCredentialsError extends AuthDomainError {
    constructor() {
        super("Not equal password or email", 401);
    }
}
