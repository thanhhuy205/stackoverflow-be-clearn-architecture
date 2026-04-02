import { config } from "@/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: config.database.url,
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
