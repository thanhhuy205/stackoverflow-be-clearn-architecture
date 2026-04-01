import { CreateUserData, UserRecord, UserRepository } from "@/modules/auth/application/ports/user.repository";
import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { PrismaClient, User } from "@prisma/client";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }
    async create(data: CreateUserData): Promise<UserRecord> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email.value,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                lastLoginAt: new Date()
            }
        })

        return this.toRecord(user);
    }
    async findByEmail(email: Email): Promise<UserRecord | null> {
        const user = await this.prisma.user.findUnique({ where: { email: email.value } });

        if (!user) return null;

        return this.toRecord(user);
    }


    private toRecord(user: User): UserRecord {
        return {
            id: user.id,
            bio: user.bio ?? "",
            avatar: user.avatar ?? "",
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            role: [user.role],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
