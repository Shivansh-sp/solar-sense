// Environment configuration
export const env = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
  
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
}

export default env
