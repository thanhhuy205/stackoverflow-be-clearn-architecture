import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class RefreshTokenNotFoundError extends AuthDomainError {
    constructor() {
        super("Refresh token not found", 404);
    }
}
