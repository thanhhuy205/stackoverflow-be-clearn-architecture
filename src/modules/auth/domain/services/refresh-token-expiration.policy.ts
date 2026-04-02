export class RefreshTokenExpirationPolicy {
    constructor(private readonly ttlInDays: number) {
        if (!Number.isInteger(ttlInDays) || ttlInDays <= 0) {
            throw new Error("Refresh token TTL must be a positive integer.");
        }
    }

    buildExpiresAt(now: Date): Date {
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + this.ttlInDays);
        return expiresAt;
    }
}
