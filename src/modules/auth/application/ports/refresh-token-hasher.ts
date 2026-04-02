export interface RefreshTokenHasher {
    hash(value: string): Promise<string>;
    generateSession(): string;
}
