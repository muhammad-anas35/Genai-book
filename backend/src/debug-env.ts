import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Loading .env.local from:', path.resolve(__dirname, '../.env.local'));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('\n=== Environment Variables ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'EXISTS (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT FOUND');
console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? 'EXISTS' : 'NOT FOUND');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'EXISTS' : 'NOT FOUND');
console.log('\n=== All env vars starting with D ===');
Object.keys(process.env).filter(k => k.startsWith('D')).forEach(k => {
    console.log(k + ':', process.env[k]?.substring(0, 50));
});
