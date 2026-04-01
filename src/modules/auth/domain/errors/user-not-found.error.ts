import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class UserNotFoundError extends AuthDomainError {
    constructor() {
        super("User not found", 404);
    }
}
