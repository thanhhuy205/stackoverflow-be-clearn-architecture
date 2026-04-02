import dotenv from "dotenv";
import { env } from "node:process";

type DatabaseConfig = {
    url: string;
};

type AuthConfig = {
    refreshTokenFixedSalt: string;
    accessTokenSecret: string;
    refreshTokenTtlInDays: number;
};

type ServerConfig = {
    port: number;
};

export class AppConfig {
    private static instance: AppConfig | null = null;

    readonly database: DatabaseConfig;
    readonly auth: AuthConfig;
    readonly server: ServerConfig;

    private constructor(database: DatabaseConfig, auth: AuthConfig, server: ServerConfig) {
        this.database = database;
        this.auth = auth;
        this.server = server;
    }

    static load(): AppConfig {
        if (AppConfig.instance) {
            return AppConfig.instance;
        }

        dotenv.config();

        const databaseUrl = AppConfig.getRequired("DATABASE_URL");
        const refreshTokenFixedSalt = AppConfig.getRequired("REFRESH_TOKEN_FIXED_SALT");
        const accessTokenSecret = AppConfig.getRequired("ACCESS_TOKEN_SECRET");
        const refreshTokenTtlInDays = AppConfig.getPositiveInteger("REFRESH_TOKEN_TTL_DAYS");
        const port = AppConfig.getOptionalPort("PORT", 5000);

        AppConfig.instance = new AppConfig(
            { url: databaseUrl },
            {
                refreshTokenFixedSalt,
                accessTokenSecret,
                refreshTokenTtlInDays,
            },
            { port },
        );

        return AppConfig.instance;
    }

    private static getRequired(name: string): string {
        const value = env[name];

        if (!value || value.trim().length === 0) {
            throw new Error(`${name} is required.`);
        }

        return value;
    }

    private static getPositiveInteger(name: string): number {
        const value = AppConfig.getRequired(name);
        const parsed = Number(value);

        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new Error(`${name} must be a positive integer.`);
        }

        return parsed;
    }

    private static getOptionalPort(name: string, fallback: number): number {
        const value = env[name];

        if (!value || value.trim().length === 0) {
            return fallback;
        }

        const parsed = Number(value);

        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new Error(`${name} must be a positive integer.`);
        }

        return parsed;
    }
}
