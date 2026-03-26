import { config } from "dotenv";
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

config({ path: ".env.local" })

export default defineConfig({
  out: './src/lib/drizzle/migrations',
  schema: './src/lib/drizzle/schema.ts',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});