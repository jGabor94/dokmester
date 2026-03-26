import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) throw new Error(
  'Please define the DATABASE_URL environment variable inside .env.local'
)

const globalForDb = global as unknown as {
  db?: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
  }
};

const client = postgres(DATABASE_URL, { prepare: false })

export const db = globalForDb.db || drizzle({ client, schema });



