import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class FirstNameRequiredError extends AuthDomainError {
    constructor() {
        super("firstName is required", 400);
    }
}
