const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment configuration...\n');

const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
    console.error('❌ ERROR: .env.local file not found!\n');
    console.log('📋 Please create .env.local file with the following variables:\n');

    if (fs.existsSync(envExamplePath)) {
        const example = fs.readFileSync(envExamplePath, 'utf-8');
        console.log(example);
    } else {
        console.log(`DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=http://localhost:6333
`);
    }

    console.log('\n📚 See SETUP.md for detailed instructions\n');
    process.exit(1);
}

// Check required variables
const envContent = fs.readFileSync(envPath, 'utf-8');
const required = ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'GEMINI_API_KEY'];
const missing = [];

required.forEach(key => {
    if (!envContent.includes(key + '=') || envContent.includes(key + '=your_')) {
        missing.push(key);
    }
});

if (missing.length > 0) {
    console.error('❌ ERROR: Missing or incomplete environment variables:\n');
    missing.forEach(key => console.log(`  - ${key}`));
    console.log('\n📚 See SETUP.md for instructions\n');
    process.exit(1);
}

console.log('✅ Environment configuration looks good!\n');
