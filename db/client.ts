// This code is designed to run in a Netlify Functions environment,
// where 'drizzle-orm' and 'postgres' libraries are expected to be available.
// @ts-ignore
import { drizzle } from 'drizzle-orm/postgres-js';
// @ts-ignore
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please run `netlify db init`.');
}

// Netlify's managed database requires SSL.
const client = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export const db = drizzle(client, { schema });
