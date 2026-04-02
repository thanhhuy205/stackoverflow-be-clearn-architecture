import {
    QuestionFilters,
    QuestionListOutput,
    QuestionQueryParams,
    QuestionRepository,
} from "@/modules/question/application/ports/question.repository";

export type GetQuestionsByUserIdInput = {
    userId: number;
    page: number;
    limit: number;
    filters?: QuestionFilters;
};

export class GetQuestionsByUserIdUseCase {
    constructor(private readonly questionRepository: QuestionRepository) { }

    async execute(input: GetQuestionsByUserIdInput): Promise<QuestionListOutput> {
        const filters: QuestionFilters = {
            ...(input.filters ?? {}),
            userId: input.userId,
        };
        const params: QuestionQueryParams = {
            page: input.page,
            limit: input.limit,
            filters,
        };

        const [items, total] = await Promise.all([
            this.questionRepository.findByUserId(input.userId, params),
            this.questionRepository.count(filters),
        ]);

        return {
            items,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages: total === 0 ? 0 : Math.ceil(total / params.limit),
            },
        };
    }
}
