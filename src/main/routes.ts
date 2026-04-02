import { AuthController } from '@/modules/auth/application/interface-adapters/http/auth.controller';
import { createAuthRoutes } from '@/modules/auth/application/interface-adapters/http/auth.routes';
import { QuestionController } from '@/modules/question/application/interface-adapters/http/question.controller';
import { createQuestionRoutes } from '@/modules/question/application/interface-adapters/http/question.router';
import { Router } from 'express';


type CreateRoutesDeps = {
    authController: AuthController;
    questionController: QuestionController;
};

export const createRoutes = (deps: CreateRoutesDeps) => {
    const router = Router();

    router.use('/auth', createAuthRoutes(deps.authController));
    router.use('/questions', createQuestionRoutes(deps.questionController));

    return router;
};
