import { AuthController } from "@/modules/auth/application/interface-adapters/http/auth.controller";
import { Router } from "express";

export const createAuthRoutes = (authController: AuthController) => {
    const router = Router();
    router.post('/register', authController.register);
    return router;
}