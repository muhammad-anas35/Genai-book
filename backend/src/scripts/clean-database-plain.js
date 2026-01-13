
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars manually to ensure they are picked up
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('❌ Database URL not found in environment variables');
    process.exit(1);
}

// Create the SQL client
// Note: neon() returns a callable tagged template function that typically also has .query()
// explicitly for cases where tagged templates are not suitable (dynamic sql construction).
const sql = neon(dbUrl);

async function cleanDatabase() {
    console.log('🧹 Starting database cleanup...');
    try {
        // We can use the tagged template for this select
        const tables = await sql`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `;

        const validTables = [
            'users', 'sessions', 'accounts', 'refresh_tokens',
            'conversations', 'chat_messages', 'chat_history',
            'documents', 'document_chunks', 'user_preferences',
            'drizzle_migrations'
        ];

        const tablesToRemove = tables
            .map(t => t.tablename)
            .filter(name => !validTables.includes(name));

        if (tablesToRemove.length === 0) {
            console.log('✅ Database is clean.');
            return;
        }

        console.log('Found tables to remove:', tablesToRemove.join(', '));

        for (const tableName of tablesToRemove) {
            // We use sql(...) function call if supported, or sql.query().
            // The error message recommended sql.query('sql string', [params]).
            // We construct the string carefully with quotes for safety against our own list (though derived from DB)
            // to handle case sensitivity if needed, though usually redundant for public schema names unless quoted on creation.
            try {
                // Trying the recommended .query method for dynamic SQL string
                // Note: The error message say `use sql.query(...)`.
                // Example: await sql.query('DROP TABLE IF EXISTS "' + tableName + '" CASCADE');
                // But typically sql object from 'neon' is just the function. 
                // However, recent versions attach .query. Let's try it.
                // If .query doesn't exist, we might have to use a different approach.
                // But let's trust the error message.

                // Construct the query string
                const query = `DROP TABLE IF EXISTS "${tableName}" CASCADE`;

                // Attempt execution
                // We access .query if it exists, otherwise fall back to a pattern that might work or fail.
                // Type-casting or checking property might be needed in TS, but this is JS.
                if (typeof sql.query === 'function') {
                    await sql.query(query);
                } else {
                    // Fallback: try calling it as a function with string (older behavior?) or mock the template array
                    // This weird invocation simulates tagged template: sql(['DROP TABLE ...', ''], val)
                    // But easier is just to rely on sql.query being present per 1.0.2+ errors.
                    console.log('⚠️ sql.query not found, trying raw call...');
                    await sql(query);
                }

                console.log(`Dropped ${tableName}`);
            } catch (optError) {
                console.error(`Failed to drop ${tableName}:`, optError.message);
                // Stop to avoid cascading errors or partial state confusion
                throw optError;
            }
        }
        console.log('✅ Cleanup complete.');
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

cleanDatabase();
