import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
console.log('Loading env from:', envPath);
const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result.error ? result.error.message : 'Success');
console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');

import { db } from './db';
import { sql } from 'drizzle-orm';



async function checkDatabase() {
    console.log('🔍 Checking database connection...');

    try {
        // Simple query to check connection
        const result = await db.execute(sql`SELECT NOW()`);
        console.log('✅ Database connection successful!');
        console.log('Timestamp from DB:', result[0]);

        // Check if tables exist (example query, might vary based on permissions)
        console.log('\n🔍 Checking for tables...');
        const tables = await db.execute(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log('Found tables:', tables.map((t: any) => t.table_name).join(', '));

        process.exit(0);
    } catch (error) {
        console.error('❌ Database check failed:', error);
        process.exit(1);
    }
}

checkDatabase();
