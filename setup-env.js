#!/usr/bin/env node

/**
 * Environment Setup Script for SolarSense
 * This script helps you set up environment variables for different environments
 */

const fs = require('fs');
const path = require('path');

// Environment configurations
const environments = {
  development: {
    MONGODB_URI: 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0',
    NODE_ENV: 'development',
    PORT: '5000',
    JWT_SECRET: 'solarsense-super-secret-jwt-key-2024',
    JWT_EXPIRE: '7d',
    CORS_ORIGIN: 'https://solar-sense-frontend.vercel.app',
    BCRYPT_ROUNDS: '12',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    LOG_LEVEL: 'info'
  },
  production: {
    MONGODB_URI: 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0',
    NODE_ENV: 'production',
    PORT: '5000',
    JWT_SECRET: 'your-super-secure-production-jwt-secret-here',
    JWT_EXPIRE: '7d',
    CORS_ORIGIN: 'https://your-frontend-domain.vercel.app',
    BCRYPT_ROUNDS: '12',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    LOG_LEVEL: 'info'
  }
};

function createEnvFile(env, targetDir) {
  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const envPath = path.join(targetDir, '.env');
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Created .env file in ${targetDir}`);
}

function displayRenderInstructions() {
  console.log('\n🚀 RENDER DEPLOYMENT INSTRUCTIONS:');
  console.log('=====================================');
  console.log('\n1. Go to https://dashboard.render.com');
  console.log('2. Create new Web Service');
  console.log('3. Connect your GitHub repository');
  console.log('4. Set Root Directory to "backend"');
  console.log('5. Add these Environment Variables:');
  console.log('\n--- COPY THESE TO RENDER ---');
  
  Object.entries(environments.production).forEach(([key, value]) => {
    console.log(`${key} = ${value}`);
  });
  
  console.log('\n--- END COPY ---');
  console.log('\n6. Deploy your service');
  console.log('7. Update CORS_ORIGIN with your frontend URL after deployment');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'dev':
      createEnvFile(environments.development, './backend');
      console.log('✅ Development environment configured');
      break;
      
    case 'prod':
      createEnvFile(environments.production, './backend');
      console.log('✅ Production environment configured');
      break;
      
    case 'render':
      displayRenderInstructions();
      break;
      
    default:
      console.log('🔧 SolarSense Environment Setup');
      console.log('================================');
      console.log('\nUsage:');
      console.log('  node setup-env.js dev     - Setup development environment');
      console.log('  node setup-env.js prod    - Setup production environment');
      console.log('  node setup-env.js render  - Show Render deployment instructions');
      console.log('\nExamples:');
      console.log('  node setup-env.js dev');
      console.log('  node setup-env.js render');
  }
}

main();
