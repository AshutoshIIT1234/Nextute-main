// Simple test script for chatbot API
// Run with: node test-chatbot.js

import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000';

const testQueries = [
  "How do I find coaching institutes?",
  "Tell me about mentorship programs",
  "What are the fees for premium mentorship?",
  "How to register as a student?",
  "What services does Nextute offer?"
];

async function testChatbot() {
  console.log('🤖 Testing Nextute Chatbot API\n');
  console.log('================================\n');

  // Test server connection
  try {
    const testResponse = await axios.get(`${BACKEND_URL}/test`);
    console.log('✅ Server is running:', testResponse.data.message);
  } catch (error) {
    console.error('❌ Server is not running. Please start the backend first.');
    console.error('   Run: cd backend && npm run dev');
    process.exit(1);
  }

  console.log('\n📝 Testing chat queries...\n');

  for (const query of testQueries) {
    try {
      console.log(`Q: ${query}`);
      
      const response = await axios.post(`${BACKEND_URL}/api/chat/query`, {
        query,
        conversationHistory: [],
        useSemanticSearch: false // Set to true if using OpenAI
      });

      console.log(`A: ${response.data.answer.substring(0, 150)}...`);
      console.log(`   Sources: ${response.data.sources.length} found`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data:`, error.response.data);
      }
      console.log('');
    }
  }

  // Test knowledge base refresh
  console.log('🔄 Testing knowledge base refresh...');
  try {
    const refreshResponse = await axios.post(`${BACKEND_URL}/api/chat/refresh`);
    console.log(`✅ ${refreshResponse.data.message}`);
    console.log(`   Entries: ${refreshResponse.data.entries}`);
  } catch (error) {
    console.error(`❌ Refresh failed: ${error.message}`);
  }

  console.log('\n================================');
  console.log('✅ Chatbot test complete!');
  console.log('\nNext steps:');
  console.log('1. Start frontend: cd frontend && npm run dev');
  console.log('2. Open http://localhost:5173');
  console.log('3. Click the chat button in bottom-right corner');
}

testChatbot().catch(console.error);
