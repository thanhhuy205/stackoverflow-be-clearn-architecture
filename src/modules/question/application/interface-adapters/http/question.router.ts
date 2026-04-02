import { QuestionController } from "@/modules/question/application/interface-adapters/http/question.controller";
import { requireAuthMiddleware } from "@/shared/interface-adapters/http/require-auth.middleware";
import { Router } from "express";

export const createQuestionRoutes = (questionController: QuestionController) => {
    const router = Router();

    router.post("/", requireAuthMiddleware, questionController.create);
    router.get("/", questionController.getQuestions);
    router.get("/user/:userId", questionController.getQuestionsByUserId);
    router.get("/:slug", questionController.getQuestionBySlug);

    return router;
};
