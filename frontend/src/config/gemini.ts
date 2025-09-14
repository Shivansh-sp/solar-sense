// Google Gemini API Configuration
export const GEMINI_CONFIG = {
  // Use the provided API key
  API_KEY: process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCNYO1KKmwuQCeRG8SpGF40NmrGkOayUJI',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  MODEL_NAME: 'gemini-1.5-flash-latest'
}

// Check if we have a valid API key
export const hasValidApiKey = () => {
  const key = GEMINI_CONFIG.API_KEY
  return key && key !== 'your-gemini-api-key-here' && key !== 'demo-key' && key.length > 20 && key.startsWith('AIza')
}

// Instructions for setting up the API key:
// 1. Go to https://makersuite.google.com/app/apikey
// 2. Create a new API key
// 3. Add it to your .env.local file as: GOOGLE_GEMINI_API_KEY=your-actual-api-key
// 4. Or set NEXT_PUBLIC_GEMINI_API_KEY=your-actual-api-key for client-side access
// 5. Restart your development server
