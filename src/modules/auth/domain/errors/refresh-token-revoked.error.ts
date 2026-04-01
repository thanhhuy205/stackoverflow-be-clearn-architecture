import { AuthDomainError } from "@/modules/auth/domain/errors/auth-domain.error";

export class RefreshTokenRevokedError extends AuthDomainError {
    constructor() {
        super("Refresh token has been revoked", 401);
    }
}
