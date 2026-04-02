import { QuestionInput } from "@/modules/question/application/dto/question.input";
import { QuestionOutput, QuestionRepository } from "@/modules/question/application/ports/question.repository";

export type CreateQuestionOutput = QuestionOutput;

export class CreateQuestionUseCase {
    constructor(private readonly questionRepository: QuestionRepository) { }

    async execute(input: QuestionInput): Promise<CreateQuestionOutput> {
        const title = input.title.trim();
        const content = input.content.trim();

        return this.questionRepository.create({
            userId: input.userId,
            title,
            content,
            slug: this.buildSlug(title),
        });
    }

    private buildSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/,/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }
}
