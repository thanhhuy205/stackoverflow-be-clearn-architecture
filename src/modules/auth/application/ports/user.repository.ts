import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { RoleCode, UserStatus } from "@prisma/client";

export type CreateUserData = {
    firstName: string;
    lastName: string;
    email: Email;
    password: string;
}

export type UserRecord = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    bio: string;
    avatar: string;
    status: UserStatus;
    verifiedAt: Date | null;
    questionsCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;

    roles: RoleCode[];
};

export interface UserRepository {
    create(data: CreateUserData): Promise<UserRecord>;
    findByEmail(email: Email): Promise<UserRecord | null>;
}