import type { AuthenticatedUser } from "@/types/common/auth.type";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }

        interface Response {
            success<T>(data: T, status?: number, message?: string): Response;
            error(error: string | Error, status?: number, message?: string): Response;
            pagination<T>(data: T[], pagination: any, status?: number): Response;
        }
    }
}

export { };

