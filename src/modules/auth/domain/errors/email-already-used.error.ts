import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class EmailAlreadyUsedError extends AuthDomainError {
    constructor() {
        super("Email already exists", 409);
    }
}
