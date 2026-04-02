import { PaginationMeta, PaginationParams } from "@/types/common/pagination.type";

export type QuestionFilters = Record<string, unknown>;

export type QuestionOutput = {
    id?: number;
    publicId?: string;
    userId: number;
    title: string;
    content: string;
    slug?: string;
    answersCount?: number;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export type QuestionQueryParams = PaginationParams & {
    filters: QuestionFilters;
};

export type QuestionListOutput = {
    items: QuestionOutput[];
    pagination: PaginationMeta;
};

export interface QuestionRepository {
    findAll(params: QuestionQueryParams): Promise<QuestionOutput[]>;
    findByUserId(userId: number, params: QuestionQueryParams): Promise<QuestionOutput[]>;
    findBySlug(slug: string): Promise<QuestionOutput | null>;
    count(filters: QuestionFilters): Promise<number>;
    create(data: QuestionOutput): Promise<QuestionOutput>;
}
