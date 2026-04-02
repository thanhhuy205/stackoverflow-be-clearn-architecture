export type QuestionProps = {
    id: number;
    publicId: string;
    userId: number;
    title: string;
    content: string;
    slug: string;
    answersCount: number;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export class QuestionEntity {
    constructor(private readonly props: QuestionProps) { }

    get id(): number {
        return this.props.id;
    }

    get publicId(): string {
        return this.props.publicId;
    }

    get userId(): number {
        return this.props.userId;
    }

    get title(): string {
        return this.props.title;
    }

    get content(): string {
        return this.props.content;
    }

    get slug(): string {
        return this.props.slug;
    }

    get answersCount(): number {
        return this.props.answersCount;
    }

    get isDeleted(): boolean {
        return this.props.isDeleted;
    }

    get deletedAt(): Date | null {
        return this.props.deletedAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    toPrimitives(): QuestionProps {
        return { ...this.props };
    }
}
