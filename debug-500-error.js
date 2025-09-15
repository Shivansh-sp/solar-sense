// Debug script to identify 500 error cause
const https = require('https');

function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Debug-Script/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function debugBackend() {
  console.log('🔍 Debugging Backend 500 Error...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await testEndpoint('https://solar-sense-backend.onrender.com/health');
    console.log(`   Status: ${health.statusCode}`);
    console.log(`   Response: ${health.body.substring(0, 200)}...\n`);

    // Test debug status endpoint
    console.log('2. Testing debug status endpoint...');
    try {
      const debug = await testEndpoint('https://solar-sense-backend.onrender.com/api/debug/status');
      console.log(`   Status: ${debug.statusCode}`);
      console.log(`   Response: ${debug.body.substring(0, 500)}...\n`);
    } catch (error) {
      console.log(`   Error: ${error.message}\n`);
    }

    // Test registration endpoint
    console.log('3. Testing registration endpoint...');
    try {
      const register = await testEndpoint('https://solar-sense-backend.onrender.com/api/auth/register', 'POST', {
        name: 'Debug Test',
        email: 'debug@test.com',
        password: 'password123',
        role: 'resident'
      });
      console.log(`   Status: ${register.statusCode}`);
      console.log(`   Response: ${register.body.substring(0, 500)}...\n`);
    } catch (error) {
      console.log(`   Error: ${error.message}\n`);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugBackend();
