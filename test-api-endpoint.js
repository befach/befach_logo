require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Test script for the auto-update API endpoint
// Make sure your development server is running first

async function testAutoUpdateAPI() {
  try {
    console.log('🧪 Testing Auto-Update API Endpoint\n');
    
    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/auto-update-substages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    console.log('📡 API Response:');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.updated_shipments) {
      console.log('\n📦 Updated Shipments:');
      result.updated_shipments.forEach(shipment => {
        console.log(`- ${shipment.tracking_id}: ${shipment.old_sub_stage} → ${shipment.new_sub_stage} (${shipment.days_elapsed} days elapsed)`);
      });
    }
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => {
        console.log(`- ${error.tracking_id}: ${error.error}`);
      });
    }
    
    console.log('\n📊 Summary:');
    console.log('Total shipments:', result.summary?.total_shipments || 0);
    console.log('Updated:', result.summary?.updated || 0);
    console.log('Errors:', result.summary?.errors || 0);
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure your development server is running:');
    console.log('npm run dev');
  }
}

// Run the test
testAutoUpdateAPI();
