import { CreateUserData, UserRecord, UserRepository } from "@/modules/auth/application/ports/user.repository";
import { Email } from "@/modules/auth/domain/values-object/email.vo";
import { Prisma, PrismaClient, RoleCode } from '@prisma/client';

type UserWithRoles = Prisma.UserGetPayload<{
    include: {
        userRoles: {
            include: {
                role: true;
            };
        };
    };
}>;

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }
    async create(data: CreateUserData): Promise<UserRecord> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email.value,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                lastLoginAt: new Date(),
                userRoles: {
                    create: [
                        {
                            role: {
                                connect: { code: RoleCode.USER }
                            }
                        }
                    ]
                }
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }

        })

        return this.toRecord(user);
    }
    async findByEmail(email: Email): Promise<UserRecord | null> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.value }, include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) return null;

        return this.toRecord(user);
    }


    private toRecord(user: UserWithRoles): UserRecord {
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio ?? "",
            avatar: user.avatar ?? "",
            status: user.status,
            verifiedAt: user.verifiedAt,
            questionsCount: user.questionsCount,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt,
            roles: user.userRoles.map((x) => x.role.code),
        };
    }
}
