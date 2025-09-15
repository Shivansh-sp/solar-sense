// Test script to check backend functionality
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend health...');
    const healthResponse = await fetch('https://solar-sense-backend.onrender.com/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    console.log('\nTesting registration...');
    const registerResponse = await fetch('https://solar-sense-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'resident'
      })
    });

    console.log('Register status:', registerResponse.status);
    const registerData = await registerResponse.text();
    console.log('Register response:', registerData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBackend();
