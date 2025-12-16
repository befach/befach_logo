// Test script for automatic sub-stage progression
// Using dynamic import for TypeScript modules

async function testAutoProgression() {
  try {
    // Dynamic import for TypeScript modules
    const { getCurrentSubStage, getDaysElapsed, getSubStagesUpToCurrent } = await import('./lib/autoSubStageProgression.js');

    console.log('🧪 Testing Automatic Sub-Stage Progression System\n');

    // Test case 1: Same day (Monday)
    const monday = new Date('2025-01-20'); // Monday
    console.log('📅 Test 1: Same day (Monday)');
    console.log('Days elapsed:', getDaysElapsed(monday));
    console.log('Current sub-stage:', getCurrentSubStage(monday));
    console.log('Completed stages:', getSubStagesUpToCurrent(monday));
    console.log('');

    // Test case 2: Next day (Tuesday)
    const tuesday = new Date('2025-01-21'); // Tuesday
    console.log('📅 Test 2: Next day (Tuesday)');
    console.log('Days elapsed:', getDaysElapsed(tuesday));
    console.log('Current sub-stage:', getCurrentSubStage(tuesday));
    console.log('Completed stages:', getSubStagesUpToCurrent(tuesday));
    console.log('');

    // Test case 3: 2 days later (Wednesday)
    const wednesday = new Date('2025-01-22'); // Wednesday
    console.log('📅 Test 3: 2 days later (Wednesday)');
    console.log('Days elapsed:', getDaysElapsed(wednesday));
    console.log('Current sub-stage:', getCurrentSubStage(wednesday));
    console.log('Completed stages:', getSubStagesUpToCurrent(wednesday));
    console.log('');

    // Test case 4: 3 days later (Thursday)
    const thursday = new Date('2025-01-23'); // Thursday
    console.log('📅 Test 4: 3 days later (Thursday)');
    console.log('Days elapsed:', getDaysElapsed(thursday));
    console.log('Current sub-stage:', getCurrentSubStage(thursday));
    console.log('Completed stages:', getSubStagesUpToCurrent(thursday));
    console.log('');

    // Test case 5: 4 days later (Friday)
    const friday = new Date('2025-01-24'); // Friday
    console.log('📅 Test 5: 4 days later (Friday)');
    console.log('Days elapsed:', getDaysElapsed(friday));
    console.log('Current sub-stage:', getCurrentSubStage(friday));
    console.log('Completed stages:', getSubStagesUpToCurrent(friday));
    console.log('');

    // Test case 6: 5 days later (Saturday)
    const saturday = new Date('2025-01-25'); // Saturday
    console.log('📅 Test 6: 5 days later (Saturday)');
    console.log('Days elapsed:', getDaysElapsed(saturday));
    console.log('Current sub-stage:', getCurrentSubStage(saturday));
    console.log('Completed stages:', getSubStagesUpToCurrent(saturday));
    console.log('');

    // Test case 7: 6+ days later (Sunday and beyond)
    const sunday = new Date('2025-01-26'); // Sunday
    console.log('📅 Test 7: 6+ days later (Sunday and beyond)');
    console.log('Days elapsed:', getDaysElapsed(sunday));
    console.log('Current sub-stage:', getCurrentSubStage(sunday));
    console.log('Completed stages:', getSubStagesUpToCurrent(sunday));
    console.log('');

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error running tests:', error.message);
  }
}

// Run the tests
testAutoProgression();
