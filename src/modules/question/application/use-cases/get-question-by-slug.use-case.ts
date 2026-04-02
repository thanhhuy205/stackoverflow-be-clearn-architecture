import { QuestionOutput, QuestionRepository } from "@/modules/question/application/ports/question.repository";
import { QuestionNotFoundError } from "@/modules/question/domain/errors/question-not-found.error";

export type GetQuestionBySlugInput = {
    slug: string;
};

export type GetQuestionBySlugOutput = QuestionOutput;

export class GetQuestionBySlugUseCase {
    constructor(private readonly questionRepository: QuestionRepository) { }

    async execute(input: GetQuestionBySlugInput): Promise<GetQuestionBySlugOutput> {
        const question = await this.questionRepository.findBySlug(input.slug);

        if (!question) {
            throw new QuestionNotFoundError();
        }

        return question;
    }
}
