import 'dotenv/config';
import { createApp } from './app';

const app = createApp();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
