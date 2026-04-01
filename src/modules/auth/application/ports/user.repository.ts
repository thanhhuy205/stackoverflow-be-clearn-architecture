import { Email } from "@/modules/auth/domain/values-object/emai.vo";

export type CreateUserData = {
    firstName: string;
    lastName: string;
    email: Email;
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
    findByEmail(email: Email): Promise<UserRecord | null>;
}