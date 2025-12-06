import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Database connection using Drizzle ORM with Neon serverless PostgreSQL
 * Note: Environment variables should be loaded before importing this module
 */

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('Please ensure .env.local exists in the backend directory with:');
    console.error('DATABASE_URL=postgresql://...');
    throw new Error('DATABASE_URL environment variable is not set. Please create backend/.env.local with DATABASE_URL from Neon.');
}

// Create Neon SQL client
const sql = neon(databaseUrl);

// Create Drizzle ORM instance with schema
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * as schema from './schema';


