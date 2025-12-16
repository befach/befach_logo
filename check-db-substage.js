const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database structure...');
    
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
    
    // Check for any existing shipments with sub-stage data
    const { data: shipments, error: shipmentsError } = await supabase
      .from('shipments')
      .select('id, tracking_id, status, subStage')
      .limit(5);
    
    if (shipmentsError) {
      console.error('❌ Error fetching shipments:', shipmentsError);
      return;
    }
    
    if (shipments && shipments.length > 0) {
      console.log('\n📦 Sample shipments:');
      shipments.forEach(shipment => {
        console.log(`  - ID: ${shipment.id}, Tracking: ${shipment.tracking_id}, Status: ${shipment.status}, SubStage: ${shipment.subStage || 'null'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabase();








