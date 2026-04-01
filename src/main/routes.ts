import { AuthController } from '@/modules/auth/application/interface-adapters/http/auth.controller';
import { createAuthRoutes } from '@/modules/auth/application/interface-adapters/http/auth.routes';
import { Router } from 'express';


type CreateRoutesDeps = {
    authController: AuthController;
};

export const createRoutes = (deps: CreateRoutesDeps) => {
    const router = Router();

    router.use('/auth', createAuthRoutes(deps.authController));

    return router;
};