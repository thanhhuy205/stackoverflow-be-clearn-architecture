import { config } from "@/config";
import { createApp } from './app';

const app = createApp();

const PORT = config.server.port;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
