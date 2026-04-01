export type CreateUserData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type UserRecord = {
    id: number;
    bio: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRepository {
    create(data: CreateUserData): Promise<UserRecord>;
    findByEmail(email: string): Promise<UserRecord | null>;
}