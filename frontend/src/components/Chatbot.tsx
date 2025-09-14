'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your SolarSense AI assistant. I can help you with questions about renewable energy, solar power systems, energy trading, smart home integration, and our platform features. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }

  useEffect(() => {
    // Add a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [messages])

  // Also scroll when loading state changes
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom()
    }
  }, [isLoading])

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText.trim()
    setInputText('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.response) {
        throw new Error('No response from server')
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      
      // Use fallback response for better user experience
      const fallbackResponse = getFallbackResponse(currentInput)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "How does solar energy trading work?",
    "What are the benefits of smart home integration?",
    "How can I optimize my energy consumption?",
    "Tell me about renewable energy forecasting",
    "What is SolarSense platform?",
    "How to get started with solar panels?",
    "What are energy storage solutions?",
    "How does the dashboard work?",
    "What is blockchain in energy?",
    "How to reduce electricity bills?"
  ]

  const chatCategories = [
    {
      title: "Solar Energy",
      icon: "☀️",
      questions: [
        "How do solar panels work?",
        "What is the best solar panel type?",
        "How much do solar panels cost?",
        "What is solar panel efficiency?"
      ]
    },
    {
      title: "Energy Trading",
      icon: "⚡",
      questions: [
        "How does peer-to-peer energy trading work?",
        "What are energy credits?",
        "How to sell excess solar energy?",
        "What is dynamic pricing?"
      ]
    },
    {
      title: "Smart Home",
      icon: "🏠",
      questions: [
        "How to integrate smart devices?",
        "What is home energy management?",
        "How to automate energy usage?",
        "What are smart thermostats?"
      ]
    },
    {
      title: "Platform Help",
      icon: "🔧",
      questions: [
        "How to use the dashboard?",
        "What are the main features?",
        "How to track energy consumption?",
        "How to set up notifications?"
      ]
    }
  ]

  const handleQuickQuestion = (question: string) => {
    // Create user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Use fallback response for better user experience
    setTimeout(() => {
      const fallbackResponse = getFallbackResponse(question)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000) // Simulate API delay
  }

  // Fallback responses for common questions
  const getFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('solar') || lowerQuestion.includes('panel')) {
      return "Solar panels convert sunlight into electricity using photovoltaic cells. They're a great renewable energy solution that can significantly reduce your electricity bills and carbon footprint. SolarSense can help you optimize your solar energy production and trading."
    }
    
    if (lowerQuestion.includes('trading') || lowerQuestion.includes('energy market')) {
      return "Energy trading on SolarSense allows you to buy and sell excess solar energy with other users in your community. You can set dynamic pricing, track your earnings, and contribute to a more sustainable energy grid. It's like a marketplace for clean energy!"
    }
    
    if (lowerQuestion.includes('smart home') || lowerQuestion.includes('automation')) {
      return "Smart home integration with SolarSense lets you automatically manage your energy consumption. You can schedule devices to run when solar production is high, optimize battery storage, and reduce your reliance on the grid."
    }
    
    if (lowerQuestion.includes('forecast') || lowerQuestion.includes('prediction')) {
      return "Our AI-powered forecasting uses weather data, historical patterns, and machine learning to predict your solar energy production with 95% accuracy. This helps you plan energy usage and maximize your trading opportunities."
    }
    
    if (lowerQuestion.includes('cost') || lowerQuestion.includes('price')) {
      return "Solar panel costs vary by location and system size, but typically range from $15,000-$25,000 for residential systems. SolarSense can help you calculate ROI, find the best deals, and track your savings over time."
    }
    
    return "I'm SolarSense AI! I can help you with questions about solar energy, energy trading, smart home integration, and our platform features. While I'm having some technical difficulties, feel free to explore our renewable energy solutions!"
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your SolarSense AI assistant. I can help you with questions about renewable energy, solar power systems, energy trading, smart home integration, and our platform features. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      }
    ])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[80vh] sm:h-[600px] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">SolarSense AI</h3>
                  <p className="text-xs text-gray-500">Renewable Energy Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {messages.length > 1 && (
                  <button
                    onClick={handleNewChat}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    New Chat
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions - Only show when there's only 1 message */}
              {messages.length === 1 && (
                <div className="px-4 pb-2 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-sm font-medium text-gray-700 mb-3 pt-3">Choose a topic to get started:</p>
                  
                  {/* Simplified Quick Questions */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.slice(0, 6).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="text-xs bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg transition-colors border border-gray-200 shadow-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                    
                    {/* Category Icons */}
                    <div className="flex justify-center space-x-4 pt-2">
                      {chatCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(category.questions[0])}
                          className="flex flex-col items-center p-2 hover:bg-white rounded-lg transition-colors"
                          title={category.title}
                        >
                          <span className="text-2xl mb-1">{category.icon}</span>
                          <span className="text-xs text-gray-600">{category.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about renewable energy, solar power, or our platform..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
