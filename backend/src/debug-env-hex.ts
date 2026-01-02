import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

console.log('Loading env from:', envPath);
const result = dotenv.config({ path: envPath });

console.log('--- Dotenv Parse Result ---');
if (result.parsed) {
    Object.keys(result.parsed).forEach(key => {
        console.log(`Key: "${key}"`);
        console.log(`  Hex: ${Buffer.from(key).toString('hex')}`);
        console.log(`  Value Length: ${result.parsed![key].length}`);
    });
} else {
    console.log('No parsed result returned.');
}

console.log('--- process.env check ---');
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL is set in process.env');
} else {
    console.log('DATABASE_URL is NOT set in process.env');
}

console.log('All keys starting with D:');
Object.keys(process.env).filter(k => k.startsWith('D')).forEach(k => {
    console.log(`"${k}": ${Buffer.from(k).toString('hex')}`);
});
