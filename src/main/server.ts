import { createApp } from "@/main/app";
import compression from "compression";
import cors from 'cors';
import 'dotenv/config';
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = createApp();
app.use(helmet());
app.use(cors());
app.use(compression());

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});


