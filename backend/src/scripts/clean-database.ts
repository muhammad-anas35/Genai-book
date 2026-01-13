import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.NEON_DATABASE_URL!);

/**
 * Clean up unwanted tables from previous projects
 * This script removes tables that are NOT part of Book RAG
 */

async function cleanDatabase() {
    console.log('🧹 Starting database cleanup...\n');

    try {
        // List all tables in the database
        const tables = await sql`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `;

        console.log('📋 Current tables in database:');
        tables.forEach((t: any) => console.log(`  - ${t.tablename}`));
        console.log();

        // Define tables that SHOULD exist for Book RAG
        const validTables = [
            'users',
            'sessions',
            'accounts',
            'refresh_tokens',
            'conversations',
            'chat_messages',
            'chat_history',
            'documents',
            'document_chunks',
            'user_preferences',
            'drizzle_migrations'  // Drizzle's internal table
        ];

        // Find tables to remove
        const tablesToRemove = tables
            .map((t: any) => t.tablename)
            .filter((name: string) => !validTables.includes(name));

        if (tablesToRemove.length === 0) {
            console.log('✅ No unwanted tables found. Database is clean!');
            return;
        }

        console.log('🗑️  Tables to be removed:');
        tablesToRemove.forEach((name: string) => console.log(`  ❌ ${name}`));
        console.log();

        console.log('⚠️  WARNING: This will permanently delete these tables and all their data!');
        console.log('⚠️  Make sure you have a backup if needed.\n');

        // Drop unwanted tables
        for (const tableName of tablesToRemove) {
            console.log(`Dropping table: ${tableName}...`);
            await sql`DROP TABLE IF EXISTS ${sql(tableName)} CASCADE`;
            console.log(`  ✅ Dropped ${tableName}`);
        }

        console.log('\n✅ Database cleanup complete!');
        console.log('\n📝 Next step: Run "npm run db:push" to create the correct schema');

    } catch (error: any) {
        console.error('❌ Error during cleanup:', error.message);
        process.exit(1);
    }
}

cleanDatabase();
