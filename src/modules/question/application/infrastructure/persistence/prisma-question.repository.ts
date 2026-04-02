import {
    QuestionFilters,
    QuestionOutput,
    QuestionQueryParams,
    QuestionRepository,
} from "@/modules/question/application/ports/question.repository";
import { Prisma, PrismaClient, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionRepository implements QuestionRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findAll(params: QuestionQueryParams): Promise<QuestionOutput[]> {
        const questions = await this.prisma.question.findMany({
            where: this.buildWhere(params.filters),
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
        });

        return questions.map((question) => this.toOutput(question));
    }

    async findByUserId(userId: number, params: QuestionQueryParams): Promise<QuestionOutput[]> {
        const questions = await this.prisma.question.findMany({
            where: this.buildWhere({
                ...params.filters,
                userId,
            }),
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
        });

        return questions.map((question) => this.toOutput(question));
    }

    async findBySlug(slug: string): Promise<QuestionOutput | null> {
        const question = await this.prisma.question.findFirst({
            where: {
                slug,
                isDeleted: false,
            },
        });

        if (!question) {
            return null;
        }

        return this.toOutput(question);
    }

    async count(filters: QuestionFilters): Promise<number> {
        return this.prisma.question.count({
            where: this.buildWhere(filters),
        });
    }

    async create(data: QuestionOutput): Promise<QuestionOutput> {
        const question = await this.prisma.question.create({
            data: {
                userId: data.userId,
                title: data.title,
                content: data.content,
                slug: data.slug ?? "",
            },
        });

        return this.toOutput(question);
    }

    private buildWhere(filters: QuestionFilters): Prisma.QuestionWhereInput {
        const userId = typeof filters.userId === "number" ? filters.userId : undefined;
        const isDeleted = typeof filters.isDeleted === "boolean" ? filters.isDeleted : false;

        return {
            ...(typeof userId === "number" ? { userId } : {}),
            isDeleted,
        };
    }

    private toOutput(question: PrismaQuestion): QuestionOutput {
        return {
            id: question.id,
            publicId: question.publicId,
            userId: question.userId,
            title: question.title,
            content: question.content,
            slug: question.slug,
            answersCount: question.answersCount,
            isDeleted: question.isDeleted,
            deletedAt: question.deletedAt,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
}
