import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

function createDb() {
  if (!connectionString) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Neon DB] DATABASE_URL is missing in environment. Using fallback mode.');
    }
    return null;
  }
  try {
    const client = neon(connectionString);
    return drizzle(client, { schema });
  } catch (error) {
    console.error('[Neon DB] Failed to initialize client:', error);
    return null;
  }
}

export const db = createDb();
export * from './schema';
