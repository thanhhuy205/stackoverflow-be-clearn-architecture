export class Email {
    constructor(public readonly value: string) { }
    static create(value: string) {
        const normalized = value.toLowerCase().trim();
        if (!normalized) throw new Error("Email is required");
        if (!normalized.includes("@")) throw new Error("Email is invalid");
        return new Email(normalized);
    }
}