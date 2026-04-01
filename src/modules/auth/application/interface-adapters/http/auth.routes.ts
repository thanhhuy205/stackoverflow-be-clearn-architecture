import { AuthController } from "@/modules/auth/application/interface-adapters/http/auth.controller";
import { requireRefreshTokenMiddleware } from "@/modules/auth/application/interface-adapters/http/middlewares/require-refresh-token.middleware";
import { Router } from "express";

export const createAuthRoutes = (authController: AuthController) => {
    const router = Router();
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/refresh-token', requireRefreshTokenMiddleware, authController.refreshToken);
    return router;
}
