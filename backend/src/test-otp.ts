/**
 * Test script for Email OTP functionality
 * Run with: npx tsx src/test-otp.ts
 */

console.log('🧪 Testing Email OTP Setup...\n');

// Test 1: Check environment variables
console.log('1️⃣ Checking environment variables...');
const requiredEnvVars = [
    'DATABASE_URL',
    'RESEND_API_KEY',
    'BETTER_AUTH_SECRET'
];

let envCheck = true;
for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
        console.log(`   ✅ ${envVar}: Set`);
    } else {
        console.log(`   ❌ ${envVar}: Missing`);
        envCheck = false;
    }
}

if (!envCheck) {
    console.log('\n❌ Some environment variables are missing!');
    process.exit(1);
}

console.log('\n✅ All environment variables are set!\n');

// Test 2: Test sending OTP
console.log('2️⃣ Testing OTP send functionality...');
console.log('   To test sending an OTP, run:');
console.log('   curl -X POST http://localhost:4000/api/auth/send-otp \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"email":"your-email@gmail.com"}\'');

console.log('\n3️⃣ Testing OTP verification...');
console.log('   After receiving the code, verify with:');
console.log('   curl -X POST http://localhost:4000/api/auth/verify-otp \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"email":"your-email@gmail.com","otp":"123456"}\'');

console.log('\n✅ Setup complete! Start the server with: npm run dev');
