import { CreateUserData, UserRecord, UserRepository } from "@/modules/auth/application/ports/user.repository";
import { PrismaClient } from "@prisma/client";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }
    async create(data: CreateUserData): Promise<UserRecord> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                lastLoginAt: new Date()
            }
        })

        return {
            id: user.id,
            bio: user.bio ?? "",
            avatar: user.avatar ?? "",
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async findByEmail(email: string): Promise<UserRecord | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        return {
            id: user.id,
            bio: user.bio ?? "",
            avatar: user.avatar ?? "",
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}