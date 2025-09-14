# SolarSense AI Chatbot Setup

## Overview
The SolarSense AI chatbot is powered by Google Gemini API and is specifically trained to stay focused on renewable energy topics. It helps users with questions about solar power, energy trading, smart home integration, and other platform features.

## Features
- **Theme-Focused**: Always redirects conversations back to renewable energy topics
- **Mobile-Responsive**: Optimized for both desktop and mobile devices
- **Real-time Chat**: Instant responses using Google Gemini API
- **Quick Questions**: Pre-defined questions to help users get started
- **Floating Button**: Easy access from any page

## Setup Instructions

### 1. Get Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables
Create a `.env.local` file in the frontend directory:

```bash
# Google Gemini API Configuration
GOOGLE_GEMINI_API_KEY=your-actual-api-key-here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Restart Development Server
After adding the API key, restart your development server:

```bash
npm run dev
```

## How It Works

### System Prompt
The chatbot uses a comprehensive system prompt that:
- Defines the bot as "SolarSense AI"
- Lists specific renewable energy topics it can discuss
- Includes guidelines to stay on-topic
- Provides fallback responses for off-topic questions

### Topic Detection
The API route includes keyword detection to identify renewable energy-related questions:
- Solar, energy, renewable, green, sustainable
- Battery, storage, grid, trading, forecasting
- Smart home, efficiency, carbon, environment
- And many more renewable energy terms

### Response Handling
- **On-topic questions**: Processed by Google Gemini API
- **Off-topic questions**: Redirected with a polite message
- **API errors**: Fallback responses provided
- **Loading states**: Animated typing indicators

## Customization

### Adding New Topics
To add new renewable energy topics, update the `renewableEnergyKeywords` array in `/src/app/api/chatbot/route.ts`:

```typescript
const renewableEnergyKeywords = [
  'solar', 'energy', 'renewable', 'green', 'sustainable',
  // Add your new keywords here
  'your-new-keyword'
]
```

### Modifying System Prompt
Update the `SYSTEM_PROMPT` in `/src/app/api/chatbot/route.ts` to change the bot's behavior:

```typescript
const SYSTEM_PROMPT = `Your custom system prompt here...`
```

### Styling
The chatbot component is located in `/src/components/Chatbot.tsx` and uses Tailwind CSS for styling. Key classes:
- `bg-gradient-to-r from-green-500 to-blue-500` - Main gradient
- `rounded-2xl` - Message bubbles
- `fixed bottom-6 right-6` - Floating button position

## Testing

### Test Questions
Try these questions to test the chatbot:
- "How does solar energy trading work?"
- "What are the benefits of smart home integration?"
- "Tell me about renewable energy forecasting"
- "How can I optimize my energy consumption?"

### Off-Topic Test
Try asking about unrelated topics to see the redirect:
- "What's the weather like?"
- "Tell me a joke"
- "How do I cook pasta?"

## Troubleshooting

### Common Issues

1. **"I'm having trouble connecting"**
   - Check if the API key is correctly set in `.env.local`
   - Verify the API key is valid and active
   - Check browser console for error messages

2. **Chatbot not responding**
   - Ensure the development server is running
   - Check if the API route is accessible at `/api/chatbot`
   - Verify network connectivity

3. **Styling issues**
   - Clear browser cache
   - Check if Tailwind CSS is properly configured
   - Verify all required dependencies are installed

### Debug Mode
To enable debug logging, add this to your `.env.local`:

```bash
NEXT_PUBLIC_DEBUG_CHATBOT=true
```

## Security Notes

- The API key is server-side only and not exposed to the client
- All user inputs are validated before sending to Gemini API
- Safety settings are configured to block harmful content
- Rate limiting should be implemented for production use

## Production Deployment

For production deployment:
1. Set the API key in your hosting platform's environment variables
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Consider implementing rate limiting
4. Monitor API usage and costs
5. Set up error logging and monitoring
