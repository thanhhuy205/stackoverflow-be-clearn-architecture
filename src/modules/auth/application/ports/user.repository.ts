export type CreateUserData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type UserRecord = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRepository {
    create(data: CreateUserData): Promise<UserRecord>;
    findByEmail(email: string): Promise<UserRecord | null>;
}