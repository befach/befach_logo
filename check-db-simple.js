const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Environment variables:');
console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('\n🔍 Checking database structure...');
    
    // Check if subStage column exists
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing shipments table:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('✅ Available columns in shipments table:');
      columns.forEach(col => console.log(`  - ${col}`));
      
      if (columns.includes('subStage')) {
        console.log('✅ subStage column exists!');
      } else {
        console.log('❌ subStage column is missing!');
        console.log('💡 You need to add this column to your database');
      }
    } else {
      console.log('ℹ️ No shipments found in database');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabase();








