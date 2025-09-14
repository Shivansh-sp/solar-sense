// Environment configuration
export const env = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://solar-sense-backend.onrender.com/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://solar-sense-backend.onrender.com',
  
  // Authentication
  JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRE: process.env.NEXT_PUBLIC_JWT_EXPIRE || '7d',
  
  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'SolarSense',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  ENABLE_WEBSOCKETS: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKETS === 'true',
  
  // External Services
  WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
  MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY || '',
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Q8x9y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9',
}

export default env
