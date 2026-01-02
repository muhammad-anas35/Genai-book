import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const dbUrl = process.env.DATABASE_URL;
console.log('DATABASE_URL loaded:', dbUrl ? 'YES' : 'NO');

async function testConnection() {
    if (!dbUrl) {
        console.error('❌ No DATABASE_URL found');
        return;
    }

    try {
        console.log('Connecting to Neon...');
        const sql = neon(dbUrl);
        const result = await sql`SELECT NOW()`;
        console.log('✅ Connection successful!');
        console.log('Time:', result[0]);
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();
