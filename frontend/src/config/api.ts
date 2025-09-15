// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'https://solar-sense-backend.onrender.com',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://solar-sense-backend.onrender.com',
    timeout: 15000,
  },
  staging: {
    baseURL: 'https://solar-sense-backend.onrender.com',
    timeout: 15000,
  }
}

const environment = process.env.NODE_ENV as keyof typeof API_CONFIG || 'development'
const config = API_CONFIG[environment]

export const API_BASE_URL = config.baseURL
export const API_TIMEOUT = config.timeout

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  
  // Energy Management
  ENERGY: {
    PRODUCTION: '/api/energy/production',
    CONSUMPTION: '/api/energy/consumption',
    STORAGE: '/api/energy/storage',
    EFFICIENCY: '/api/energy/efficiency',
  },
  
  // Market Trading
  MARKET: {
    TRADES: '/api/market/trades',
    ORDERS: '/api/market/orders',
    PRICES: '/api/market/prices',
    HISTORY: '/api/market/history',
  },
  
  // Forecasting
  FORECAST: {
    SOLAR: '/api/forecast/solar',
    DEMAND: '/api/forecast/demand',
    PRICES: '/api/forecast/prices',
    WEATHER: '/api/forecast/weather',
  },
  
  // Device Control
  DEVICE: {
    LIST: '/api/device/list',
    CONTROL: '/api/device/control',
    STATUS: '/api/device/status',
    SCHEDULE: '/api/device/schedule',
  },
  
  // Dashboard
  DASHBOARD: {
    OVERVIEW: '/api/dashboard/overview',
    ANALYTICS: '/api/dashboard/analytics',
    METRICS: '/api/dashboard/metrics',
  },
  
  // Health Check
  HEALTH: '/health',
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

// Helper function for API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint)
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
  
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
  )
  
  const response = await Promise.race([
    fetch(url, { ...defaultOptions, ...options }),
    timeoutPromise
  ]) as Response
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

const apiConfig = {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
  buildApiUrl,
  apiRequest,
}

export default apiConfig
