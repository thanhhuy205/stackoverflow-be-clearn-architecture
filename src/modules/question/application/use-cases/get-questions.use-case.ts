import {
    QuestionFilters,
    QuestionListOutput,
    QuestionQueryParams,
    QuestionRepository,
} from "@/modules/question/application/ports/question.repository";

export type GetQuestionsInput = {
    page: number;
    limit: number;
    filters?: QuestionFilters;
};

export class GetQuestionsUseCase {
    constructor(private readonly questionRepository: QuestionRepository) { }

    async execute(input: GetQuestionsInput): Promise<QuestionListOutput> {
        const params: QuestionQueryParams = {
            page: input.page,
            limit: input.limit,
            filters: input.filters ?? {},
        };

        const [items, total] = await Promise.all([
            this.questionRepository.findAll(params),
            this.questionRepository.count(params.filters),
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
