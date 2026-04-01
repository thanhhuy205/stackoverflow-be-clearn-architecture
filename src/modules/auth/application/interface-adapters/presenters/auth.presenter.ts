import { RegisterOutput } from "@/modules/auth/application/use-cases/register.use-case";

export class AuthPresenter {
    presentRegisteredUser(data: RegisterOutput) {
        return {
            id: data.id,
            bio: data.bio ?? "",
            avatar: data.avatar ?? "",
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: data.createdAt,
        };
    }
} 