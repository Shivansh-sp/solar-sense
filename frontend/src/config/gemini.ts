// Google Gemini API Configuration
export const GEMINI_CONFIG = {
  API_KEY: process.env.GOOGLE_GEMINI_API_KEY || 'your-gemini-api-key-here',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  MODEL_NAME: 'gemini-1.5-flash-latest'
}

// Instructions for setting up the API key:
// 1. Go to https://makersuite.google.com/app/apikey
// 2. Create a new API key
// 3. Add it to your .env.local file as: GOOGLE_GEMINI_API_KEY=your-actual-api-key
// 4. Restart your development server
