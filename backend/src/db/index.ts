import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Database connection using Drizzle ORM with Neon serverless PostgreSQL
 * Uses lazy initialization to ensure environment variables are loaded first
 */

let _db: NeonHttpDatabase<typeof schema> | null = null;

function initializeDb() {
    if (_db) return _db;

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
    _db = drizzle(sql, { schema });

    return _db;
}

// Export a getter that lazily initializes the database
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(target, prop) {
        const database = initializeDb();
        return (database as any)[prop];
    }
});

// Re-export schema for convenience
export * as schema from './schema';



