import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class EmailRequiredError extends AuthDomainError {
    constructor() {
        super("Email is required", 400);
    }
}
