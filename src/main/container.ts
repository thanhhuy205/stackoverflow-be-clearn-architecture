import { BcryptPasswordHasher } from "@/modules/auth/application/infrastructure/crypto/bcrypt-password-hasher";
import { PrismaUserRepository } from "@/modules/auth/application/infrastructure/persistence/prisma-user.repository";
import { AuthController } from "@/modules/auth/application/interface-adapters/http/auth.controller";
import { AuthPresenter } from "@/modules/auth/application/interface-adapters/presenters/auth.presenter";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { prisma } from "@/shared/infrastructure/prisma/prisma.client";

export const buildContainer = () => {
    const userRepository = new PrismaUserRepository(prisma);
    const passwordHasher = new BcryptPasswordHasher(10);

    const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);

    const authPresenter = new AuthPresenter();
    const authController = new AuthController(registerUseCase, authPresenter);

    return { authController };
};