// Debug script to test the API endpoint
const fetch = require('node-fetch');

async function testAPIDebug() {
  console.log('🔍 Debugging API Endpoint...\n');
  
  try {
    console.log('📡 Testing API endpoint: http://localhost:3000/api/auto-update-substages');
    
    const response = await fetch('http://localhost:3000/api/auto-update-substages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📄 Response Body:');
    console.log(text);
    
    if (response.ok) {
      try {
        const json = JSON.parse(text);
        console.log('\n✅ API Response (Parsed):');
        console.log(JSON.stringify(json, null, 2));
      } catch (parseError) {
        console.log('\n❌ Could not parse JSON response');
      }
    } else {
      console.log('\n❌ API returned error status');
    }
    
  } catch (error) {
    console.log('❌ Error testing API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Development server is not running. Start it with:');
      console.log('   npm run dev');
    }
  }
}

testAPIDebug();



