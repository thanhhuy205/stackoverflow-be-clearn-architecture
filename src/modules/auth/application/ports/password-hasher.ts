export interface PasswordHasher {
    hash(value: string): Promise<string>;
    compare(pass: string, hash: string): Promise<Boolean>;
}