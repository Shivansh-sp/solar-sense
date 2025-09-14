import { NextRequest, NextResponse } from 'next/server'
import { GEMINI_CONFIG } from '@/config/gemini'

// System prompt to keep the chatbot focused on SolarSense and renewable energy
const SYSTEM_PROMPT = `You are SolarSense AI, a specialized assistant for a renewable energy platform. Your role is to help users with questions related to:

1. Solar energy systems and installation
2. Energy trading and market dynamics
3. Smart home integration with renewable energy
4. Energy forecasting and analytics
5. Grid integration and energy storage
6. Community energy networks
7. Revenue optimization from renewable energy
8. Security and blockchain in energy trading
9. Environmental benefits of renewable energy
10. SolarSense platform features and capabilities

IMPORTANT GUIDELINES:
- Always stay focused on renewable energy, solar power, and related topics
- If asked about unrelated topics (cooking, sports, entertainment, etc.), politely redirect to renewable energy topics
- Provide accurate, helpful information about solar energy, energy efficiency, and sustainability
- Be encouraging about renewable energy adoption
- Use technical terms appropriately but explain them clearly
- Always mention how topics relate to SolarSense platform when relevant
- Keep responses concise but informative (2-3 sentences typically)
- Be friendly, professional, and enthusiastic about clean energy

If a user asks about something completely unrelated to renewable energy, respond with:
"I'm SolarSense AI, specialized in renewable energy and solar power topics. I'd be happy to help you with questions about solar energy systems, energy trading, smart home integration, or any other renewable energy topics. What would you like to know about clean energy solutions?"

Remember: Stay on topic and always relate back to renewable energy and SolarSense platform capabilities.`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if the message is related to renewable energy
    const renewableEnergyKeywords = [
      'solar', 'energy', 'renewable', 'green', 'sustainable', 'electricity', 'power',
      'battery', 'storage', 'grid', 'trading', 'forecasting', 'analytics', 'smart home',
      'efficiency', 'carbon', 'environment', 'clean', 'wind', 'hydro', 'geothermal',
      'photovoltaic', 'inverter', 'panel', 'watt', 'kwh', 'consumption', 'generation',
      'net metering', 'feed-in tariff', 'energy market', 'blockchain', 'community',
      'microgrid', 'load balancing', 'peak shaving', 'demand response', 'solarsense'
    ]

    const messageLower = message.toLowerCase()
    const isRelatedToRenewableEnergy = renewableEnergyKeywords.some(keyword => 
      messageLower.includes(keyword)
    )

    // If not related to renewable energy, provide a redirect response
    if (!isRelatedToRenewableEnergy) {
      return NextResponse.json({
        response: "I'm SolarSense AI, specialized in renewable energy and solar power topics. I'd be happy to help you with questions about solar energy systems, energy trading, smart home integration, or any other renewable energy topics. What would you like to know about clean energy solutions?"
      })
    }

    // Prepare the request to Google Gemini
    const geminiRequest = {
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    const response = await fetch(`${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API')
    }

    const botResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      response: botResponse
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    // Fallback responses for different error scenarios
    const fallbackResponses = [
      "I'm experiencing some technical difficulties right now. Please try asking your question again in a moment.",
      "I'm having trouble processing your request. Could you please rephrase your question about renewable energy?",
      "I'm temporarily unavailable, but I'd be happy to help you with solar energy questions when I'm back online."
    ]
    
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    return NextResponse.json({
      response: randomFallback
    })
  }
}
