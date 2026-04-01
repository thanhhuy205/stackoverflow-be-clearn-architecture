import { errorMiddleware } from '@/shared/interface-adapters/http/error-handler.middleware';
import { responseMiddleware } from '@/shared/interface-adapters/http/response-handler.middleware';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { buildContainer } from './container';
import { createRoutes } from './routes';


export const createApp = () => {
    const app: Express = express();

    app.use(express.json({ limit: '10mb' }));
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
    });
    app.use(limiter);
    app.use(responseMiddleware);

    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    app.use("/api", createRoutes(buildContainer()));

    app.use((req, res) => {
        res.error('Route not found', 404, 'NOT_FOUND');
    });
    app.use(errorMiddleware);
    return app;
}