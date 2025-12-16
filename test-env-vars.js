// Test environment variables for the API
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n🔧 All Environment Variables:');
Object.keys(process.env).forEach(key => {
  if (key.includes('SUPABASE') || key.includes('NEXT')) {
    const value = process.env[key];
    console.log(`${key}: ${value ? value.substring(0, 30) + '...' : 'NOT SET'}`);
  }
});

console.log('\n💡 If any required variables are missing, check your .env.local file');



