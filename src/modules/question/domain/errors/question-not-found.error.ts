import { QuestionDomainError } from "@/modules/question/domain/errors/question-domain.error";

export class QuestionNotFoundError extends QuestionDomainError {
    constructor() {
        super("Question not found", 404);
    }
}
