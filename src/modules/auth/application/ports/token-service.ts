export interface TokenService {
    signAccessToken(payload: { userId: string, role: string, sessionId: string }): Promise<string>;
    signRefreshToken(): Promise<string>;
}