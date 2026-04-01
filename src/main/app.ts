import { errorMiddleware } from '@/shared/interface-adapters/http/error-handler.midleware';
import { responseMiddleware } from '@/shared/interface-adapters/http/response-handler.middleware';
import express, { Express } from 'express';


const app: Express = express();
app.use(responseMiddleware);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
    res.success({ status: 'healthy' });
});

// 404 handler
app.use((req, res) => {
    res.error('Route not found', 404, 'NOT_FOUND');
});

app.use(errorMiddleware);
export default app; 