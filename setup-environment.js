#!/usr/bin/env node

/**
 * Environment Setup Script for SolarSense
 * Sets up environment variables and validates configuration
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);
const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);
const logHeader = (message) => log(`\n🚀 ${message}`, colors.cyan + colors.bright);

// Environment configurations
const environments = {
  development: {
    NODE_ENV: 'development',
    PORT: '5000',
    MONGODB_URI: 'mongodb+srv://shivanshpushkarna_db_user:CFM6tSoP5vd1mhBE@cluster0.x6fhvdz.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0',
    JWT_SECRET: 'solarsense_2024_secure_jwt_secret_key_8f7e6d5c4b3a2918',
    JWT_EXPIRE: '7d',
    CORS_ORIGIN: 'http://localhost:3000,https://solar-sense-final.onrender.com',
    API_VERSION: 'v1',
    BCRYPT_ROUNDS: '12',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    WEATHER_API_KEY: 'demo-weather-api-key',
    MQTT_BROKER_URL: 'mqtt://localhost:1883',
    MQTT_TOPIC_PREFIX: 'solarsense',
    STRIPE_SECRET_KEY: 'sk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9',
    STRIPE_WEBHOOK_SECRET: 'whsec_1234567890abcdef1234567890abcdef12345678'
  },
  production: {
    NODE_ENV: 'production',
    PORT: '5000',
    MONGODB_URI: 'mongodb+srv://shivanshpushkarna_db_user:CFM6tSoP5vd1mhBE@cluster0.x6fhvdz.mongodb.net/solarsense?retryWrites=true&w=majority&appName=Cluster0',
    JWT_SECRET: 'solarsense_2024_secure_jwt_secret_key_8f7e6d5c4b3a2918',
    JWT_EXPIRE: '7d',
    CORS_ORIGIN: 'https://solar-sense-final.onrender.com,https://solar-sense-backend.onrender.com',
    API_VERSION: 'v1',
    BCRYPT_ROUNDS: '12',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    WEATHER_API_KEY: 'demo-weather-api-key',
    MQTT_BROKER_URL: 'mqtt://localhost:1883',
    MQTT_TOPIC_PREFIX: 'solarsense',
    STRIPE_SECRET_KEY: 'sk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9',
    STRIPE_WEBHOOK_SECRET: 'whsec_1234567890abcdef1234567890abcdef12345678'
  }
};

function createEnvFile(env, targetDir) {
  const envPath = path.join(targetDir, '.env');
  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContent);
  logSuccess(`Created .env file in ${targetDir}`);
}

function validateEnvironment(env) {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'CORS_ORIGIN'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    logError(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  logSuccess('Environment validation passed');
  return true;
}

function setupEnvironment(envType = 'development') {
  logHeader(`Setting up ${envType} environment...`);
  
  const env = environments[envType];
  if (!env) {
    logError(`Unknown environment: ${envType}`);
    process.exit(1);
  }
  
  // Validate environment
  if (!validateEnvironment(env)) {
    process.exit(1);
  }
  
  // Create backend .env
  createEnvFile(env, './backend');
  
  // Create frontend .env.local
  const frontendEnv = {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_API_URL: envType === 'production' 
      ? 'https://solar-sense-backend.onrender.com/api'
      : 'http://localhost:5000/api',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: env.STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'your-google-client-id',
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: 'your-google-client-secret',
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: envType === 'production'
      ? 'https://solar-sense-final.onrender.com/auth/google/callback'
      : 'http://localhost:3000/auth/google/callback'
  };
  
  createEnvFile(frontendEnv, './frontend');
  
  logSuccess(`Environment setup complete for ${envType}`);
  logInfo(`Backend will run on port ${env.PORT}`);
  logInfo(`Frontend API URL: ${frontendEnv.NEXT_PUBLIC_API_URL}`);
  logInfo(`CORS Origins: ${env.CORS_ORIGIN}`);
}

// Main execution
const envType = process.argv[2] || 'development';
setupEnvironment(envType);
