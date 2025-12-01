import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

// جعل قاعدة البيانات اختيارية - النظام يعمل بدون PostgreSQL
const dbUrl = process.env.DATABASE_URL || '';

export const pool = dbUrl ? new Pool({ connectionString: dbUrl }) : null;
export const db = pool ? drizzle({ client: pool, schema }) : null;
