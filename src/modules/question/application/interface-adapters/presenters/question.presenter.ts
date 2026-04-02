import { QuestionOutput } from "@/modules/question/application/ports/question.repository";

export class QuestionPresenter {
    presentQuestion(data: QuestionOutput) {
        return {
            id: data.id,
            publicId: data.publicId,
            userId: data.userId,
            title: data.title,
            content: data.content,
            slug: data.slug,
            answersCount: data.answersCount,
            isDeleted: data.isDeleted,
            deletedAt: data.deletedAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    presentQuestions(data: QuestionOutput[]) {
        return data.map((question) => this.presentQuestion(question));
    }
}
