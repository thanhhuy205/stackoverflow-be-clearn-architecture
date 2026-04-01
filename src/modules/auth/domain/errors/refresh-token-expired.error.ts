import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class RefreshTokenExpiredError extends AuthDomainError {
    constructor() {
        super("Refresh token has expired", 401);
    }
}
