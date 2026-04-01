

declare global {
    namespace Express {
        interface Response {
            success<T>(data: T, status?: number, message?: string): Response;
            error(error: string | Error, status?: number, message?: string): Response;
            pagination<T>(data: T[], pagination: any, status?: number): Response;
        }
    }
}

export { };

