export abstract class QuestionDomainError extends Error {
    readonly status: number;

    protected constructor(message: string, status: number) {
        super(message);
        this.name = new.target.name;
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
