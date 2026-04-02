import { QuestionPresenter } from "@/modules/question/application/interface-adapters/presenters/question.presenter";
import { CreateQuestionUseCase } from "@/modules/question/application/use-cases/create-question.use-case";
import { GetQuestionBySlugUseCase } from "@/modules/question/application/use-cases/get-question-by-slug.use-case";
import { GetQuestionsByUserIdUseCase } from "@/modules/question/application/use-cases/get-questions-by-user-id.use-case";
import { GetQuestionsUseCase } from "@/modules/question/application/use-cases/get-questions.use-case";
import { Request, Response } from "express";

export class QuestionController {
    constructor(
        private readonly createQuestionUseCase: CreateQuestionUseCase,
        private readonly getQuestionsUseCase: GetQuestionsUseCase,
        private readonly getQuestionsByUserIdUseCase: GetQuestionsByUserIdUseCase,
        private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
        private readonly questionPresenter: QuestionPresenter,
    ) { }

    create = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.error("Unauthorized", 401, "UNAUTHORIZED");
        }

        const output = await this.createQuestionUseCase.execute({
            title: this.readString(req.body?.title),
            content: this.readString(req.body?.content),
            userId: req.user.userId,
        });

        const data = this.questionPresenter.presentQuestion(output);

        return res.success(data, 201, "Create question successfully");
    };

    getQuestions = async (req: Request, res: Response) => {
        const output = await this.getQuestionsUseCase.execute({
            page: this.parsePositiveInteger(req.query.page, 1),
            limit: this.parsePositiveInteger(req.query.limit, 10),
            filters: {},
        });
        const data = this.questionPresenter.presentQuestions(output.items);

        return res.pagination(data, output.pagination, 200);
    };

    getQuestionsByUserId = async (req: Request, res: Response) => {
        const output = await this.getQuestionsByUserIdUseCase.execute({
            userId: this.parseRequiredPositiveInteger(req.params.userId, "userId"),
            page: this.parsePositiveInteger(req.query.page, 1),
            limit: this.parsePositiveInteger(req.query.limit, 10),
            filters: {},
        });
        const data = this.questionPresenter.presentQuestions(output.items);

        return res.pagination(data, output.pagination, 200);
    };

    getQuestionBySlug = async (req: Request, res: Response) => {
        const output = await this.getQuestionBySlugUseCase.execute({
            slug: this.readString(req.params.slug),
        });
        const data = this.questionPresenter.presentQuestion(output);

        return res.success(data, 200, "Get question successfully");
    };

    private parsePositiveInteger(value: unknown, fallback: number): number {
        const parsed = Number(value);

        if (!Number.isInteger(parsed) || parsed <= 0) {
            return fallback;
        }

        return parsed;
    }

    private parseRequiredPositiveInteger(value: unknown, fieldName: string): number {
        const parsed = Number(this.readString(value));

        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new Error(`${fieldName} must be a positive integer`);
        }

        return parsed;
    }

    private readString(value: unknown): string {
        return typeof value === "string" ? value : "";
    }
}
