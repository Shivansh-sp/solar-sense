import { NextRequest, NextResponse } from 'next/server'
import { GEMINI_CONFIG, hasValidApiKey } from '@/config/gemini'

// System prompt to keep the chatbot helpful and focused on SolarSense and renewable energy
const SYSTEM_PROMPT = `You are SolarSense AI, a helpful and knowledgeable assistant for a renewable energy platform. Your primary expertise is in renewable energy, but you can also help with general questions.

Your main areas of expertise:
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

GUIDELINES:
- Be helpful, friendly, and conversational
- For renewable energy questions: Provide detailed, expert advice
- For general questions: Answer helpfully but briefly, then suggest renewable energy topics
- For SolarSense platform questions: Provide specific guidance about features
- Keep responses informative but not too long (1-3 paragraphs)
- If you don't know something, admit it and offer to help with what you do know
- Always be encouraging about renewable energy adoption
- End responses by asking how else you can help

Current context: User is interacting with the SolarSense platform, a comprehensive renewable energy management system.`

// Intelligent fallback responses when API key is not available
function getIntelligentResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Solar energy questions
  if (lowerMessage.includes('solar') || lowerMessage.includes('panel') || lowerMessage.includes('photovoltaic')) {
    return `Solar panels are an excellent renewable energy solution for India! They convert sunlight into electricity using photovoltaic cells. Here's what you should know:

• **How they work**: Photovoltaic cells absorb sunlight and generate direct current (DC) electricity
• **Benefits**: Reduce electricity bills by 70-90%, increase property value, and reduce carbon footprint
• **Cost**: Typically ₹3,00,000-₹5,00,000 for residential systems (5-10kW), with payback in 4-7 years
• **Efficiency**: Modern panels are 15-22% efficient, with higher efficiency panels available
• **Indian Context**: 
  - 300+ sunny days per year in most regions
  - High electricity rates (₹6-₹12 per unit) make solar very attractive
  - Government subsidies up to 30% under PM-KUSUM scheme
  - Net metering allows selling excess energy back to grid

SolarSense can help you optimize your solar investment with AI-powered forecasting and peer-to-peer energy trading. Would you like to know more about any specific aspect of solar energy in India?`
  }
  
  // Energy trading questions
  if (lowerMessage.includes('trading') || lowerMessage.includes('energy market') || lowerMessage.includes('sell energy')) {
    return `Energy trading on SolarSense is revolutionary for India! Here's how it works:

• **Peer-to-Peer Trading**: Sell excess solar energy directly to neighbors and businesses
• **Dynamic Pricing**: Set your own prices (typically ₹4-₹8 per unit) based on demand and supply
• **Smart Contracts**: Blockchain-secured transactions ensure fair and transparent trading
• **Real-time Dashboard**: Track your earnings and energy production in real-time
• **Community Benefits**: Contribute to a more sustainable and resilient energy grid
• **Indian Market Context**:
  - Trade during peak hours when grid rates are highest (₹8-₹12 per unit)
  - Earn ₹2,000-₹5,000 per month from excess energy sales
  - Help reduce load on India's power grid
  - Support local communities with clean energy

You can earn money from your solar investment by selling excess energy when production is high and demand is low. The platform handles all the technical aspects automatically!`
  }
  
  // Smart home questions
  if (lowerMessage.includes('smart home') || lowerMessage.includes('automation') || lowerMessage.includes('smart device')) {
    return `Smart home integration with SolarSense transforms how you manage energy in India:

• **Automated Energy Management**: Devices automatically adjust based on solar production
• **Load Balancing**: Distribute energy usage throughout the day for maximum efficiency
• **Battery Optimization**: Smart charging and discharging based on energy prices
• **Device Scheduling**: Run high-energy appliances when solar production is peak
• **Real-time Monitoring**: Control and monitor all devices from one dashboard
• **Indian Smart Home Features**:
  - Schedule AC usage during peak solar hours (10 AM - 4 PM)
  - Automatically charge electric vehicles during low-cost periods
  - Optimize water heater usage based on solar availability
  - Smart lighting that adjusts to natural light patterns

This can reduce your energy costs by 40-60% while maximizing your solar investment returns!`
  }
  
  // Forecasting questions
  if (lowerMessage.includes('forecast') || lowerMessage.includes('prediction') || lowerMessage.includes('weather')) {
    return `Our AI-powered forecasting is incredibly accurate! Here's how it works:

• **95% Accuracy**: Uses machine learning algorithms trained on historical data
• **Weather Integration**: Real-time weather data from multiple sources
• **Pattern Recognition**: Learns from your specific solar system's performance
• **Predictive Analytics**: Forecasts energy production up to 7 days in advance
• **Trading Optimization**: Helps you plan when to buy/sell energy for maximum profit

This technology helps you make informed decisions about energy usage and trading opportunities!`
  }
  
  // Cost and financial questions
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('roi') || lowerMessage.includes('investment')) {
    return `Solar energy is a smart financial investment in India! Here's the breakdown:

• **System Cost**: ₹3,00,000-₹5,00,000 for typical residential systems (5-10kW)
• **Payback Period**: 4-7 years depending on location and electricity rates
• **Lifetime Savings**: ₹8,00,000-₹20,00,000 over 25+ years
• **Government Incentives**: 
  - 30% subsidy under PM-KUSUM scheme
  - Net metering benefits
  - State-specific incentives (up to ₹50,000 additional)
• **Property Value**: Increases home value by ₹5,00,000-₹8,00,000 on average
• **Energy Trading**: Additional income of ₹2,000-₹5,000 per month from selling excess energy
• **Electricity Bill Savings**: 70-90% reduction in monthly bills

SolarSense helps maximize your ROI through intelligent energy management and peer-to-peer trading!`
  }
  
  // General renewable energy questions
  if (lowerMessage.includes('renewable') || lowerMessage.includes('green energy') || lowerMessage.includes('sustainability')) {
    return `Renewable energy is the future, and SolarSense is leading the way! Here's why it matters:

• **Environmental Impact**: Solar energy produces zero emissions during operation
• **Energy Independence**: Reduce reliance on fossil fuels and grid power
• **Economic Benefits**: Create jobs and stimulate local economies
• **Grid Resilience**: Distributed energy systems are more reliable
• **Community Power**: Enable energy sharing and community resilience

Our platform makes renewable energy accessible, profitable, and sustainable for everyone!`
  }
  
  // Platform features questions
  if (lowerMessage.includes('platform') || lowerMessage.includes('features') || lowerMessage.includes('dashboard')) {
    return `SolarSense offers a comprehensive renewable energy platform:

• **AI Forecasting**: 95% accurate energy production predictions
• **Energy Trading**: Peer-to-peer marketplace for buying/selling energy
• **Smart Home Integration**: Automated energy management
• **Real-time Analytics**: Detailed insights into your energy usage
• **Community Features**: Connect with other renewable energy users
• **Blockchain Security**: Secure, transparent energy transactions

Everything is designed to maximize your renewable energy investment and environmental impact!`
  }

  // Platform help questions
  if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('guide') || lowerMessage.includes('tutorial')) {
    return `I'm here to help you navigate the SolarSense platform! Here's how to get started:

**🏠 Getting Started:**
• **Sign Up**: Create your account with household details and solar capacity
• **Dashboard**: View your energy production, consumption, and earnings
• **Profile Setup**: Add your solar system specifications and location

**⚡ Energy Management:**
• **Production Tracking**: Monitor real-time solar energy generation
• **Consumption Analysis**: Track your household energy usage patterns
• **Battery Management**: Optimize storage and discharge cycles

**💰 Energy Trading:**
• **Sell Excess Energy**: List your surplus solar energy for sale
• **Buy Energy**: Purchase energy from neighbors during low production
• **Price Setting**: Set competitive rates based on market demand
• **Earnings Tracking**: Monitor your trading profits in real-time

**🤖 AI Features:**
• **Smart Forecasting**: Get accurate predictions for energy production
• **Load Optimization**: Automatically schedule high-energy appliances
• **Trading Recommendations**: AI suggests optimal buy/sell times

**📱 Mobile Access:**
• **Real-time Notifications**: Get alerts for trading opportunities
• **Remote Control**: Manage your smart devices from anywhere
• **Community Chat**: Connect with other solar energy users

Need help with a specific feature? Just ask me!`
  }
  
  // Default response
  return `I'm SolarSense AI, your renewable energy assistant for India! I can help you with:

• Solar panel installation and optimization for Indian homes
• Energy trading and market dynamics in India
• Smart home integration and automation
• Energy forecasting and analytics
• Cost analysis and ROI calculations in Indian Rupees
• Platform features and usage guide
• Government schemes and subsidies (PM-KUSUM, net metering)
• Indian electricity rates and grid integration

What specific aspect of renewable energy or our platform would you like to explore? I'm here to help you make the most of your clean energy journey in India!`
}

export async function POST(request: NextRequest) {
  let message = 'general question' // Default fallback message
  
  try {
    const requestData = await request.json()
    message = requestData.message

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if we have a valid API key
    if (!hasValidApiKey()) {
      // Provide intelligent fallback responses
      const fallbackResponse = getIntelligentResponse(message)
      return NextResponse.json({
        response: fallbackResponse
      })
    }

    console.log('Using Gemini API with key:', GEMINI_CONFIG.API_KEY.substring(0, 10) + '...')

    // Process all messages - no keyword filtering

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
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      
      // Handle specific error cases
      if (response.status === 400) {
        console.log('Bad request, using fallback response')
        const fallbackResponse = getIntelligentResponse(message)
        return NextResponse.json({
          response: fallbackResponse
        })
      }
      
      if (response.status === 403) {
        console.log('API key issue, using fallback response')
        const fallbackResponse = getIntelligentResponse(message)
        return NextResponse.json({
          response: fallbackResponse
        })
      }
      
      // For other errors, use fallback
      console.log('API error, using fallback response')
      const fallbackResponse = getIntelligentResponse(message)
      return NextResponse.json({
        response: fallbackResponse
      })
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
    
    // Always use intelligent fallback response
    const fallbackResponse = getIntelligentResponse(message)
    
    return NextResponse.json({
      response: fallbackResponse
    })
  }
}
