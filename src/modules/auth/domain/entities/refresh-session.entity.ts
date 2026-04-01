export type RefreshSessionProps = {
    userId: number;
    expiresAt: Date;
    hashToken: string;
    sessionId: string;
    revoked: boolean;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export class RefreshSessionEntity {
    constructor(private readonly props: RefreshSessionProps) { }

    get userId(): number {
        return this.props.userId;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get hashToken(): string {
        return this.props.hashToken;
    }

    get sessionId(): string {
        return this.props.sessionId;
    }

    get revoked(): boolean {
        return this.props.revoked;
    }

    get revokedAt(): Date | null {
        return this.props.revokedAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    isExpired(referenceDate: Date): boolean {
        return this.props.expiresAt.getTime() <= referenceDate.getTime();
    }
}
