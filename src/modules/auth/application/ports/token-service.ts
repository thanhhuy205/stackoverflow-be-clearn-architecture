export interface TokenService {
    signAccessToken(payload: { userId: number, role: string[], sessionId: string }): Promise<string>;
    signRefreshToken(): Promise<string>;
}