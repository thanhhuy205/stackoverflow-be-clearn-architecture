import { buildContainer } from '@/main/container';
import { createRoutes } from '@/main/routes';
import { errorMiddleware } from '@/shared/interface-adapters/http/error-handler.midleware';
import { responseMiddleware } from '@/shared/interface-adapters/http/response-handler.middleware';
import express, { Express } from 'express';


export const createApp = () => {
    const app: Express = express();
    app.use(express.json({ limit: '10mb' }));

    app.use(responseMiddleware);

    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    app.use("/api", createRoutes(buildContainer()));

    app.use((req, res) => {
        res.error('Route not found', 404, 'NOT_FOUND');
    });
    app.use(errorMiddleware);
    return app;
}