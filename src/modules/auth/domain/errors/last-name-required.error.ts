import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class LastNameRequiredError extends AuthDomainError {
    constructor() {
        super("lastName is required", 400);
    }
}
