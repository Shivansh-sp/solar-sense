'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SunIcon, 
  BoltIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  HomeIcon,
  CogIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import LoginModal from './LoginModal';
import DemoModal from './DemoModal';
import Chatbot from './Chatbot';
import CodeTyransLogo from './CodeTyransLogo';

const features = [
  {
    id: 'forecasting',
    icon: SunIcon,
    title: 'Solar Forecasting',
    description: 'AI-powered solar energy prediction with 95% accuracy',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    href: '/features/forecasting'
  },
  {
    id: 'trading',
    icon: BoltIcon,
    title: 'Energy Trading',
    description: 'Decentralized peer-to-peer energy marketplace',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600',
    href: '/features/trading'
  },
  {
    id: 'analytics',
    icon: ChartBarIcon,
    title: 'Smart Analytics',
    description: 'Real-time energy consumption and production insights',
    color: 'bg-gradient-to-r from-green-400 to-emerald-500',
    href: '/features/analytics'
  },
  {
    id: 'revenue',
    icon: CurrencyDollarIcon,
    title: 'Revenue Optimization',
    description: 'Maximize your solar investment returns',
    color: 'bg-gradient-to-r from-pink-500 to-rose-500',
    href: '/features/revenue'
  },
  {
    id: 'smart-homes',
    icon: HomeIcon,
    title: 'Smart Homes',
    description: 'Intelligent energy management for households',
    color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    href: '/features/smart-homes'
  },
  {
    id: 'grid',
    icon: CogIcon,
    title: 'Grid Integration',
    description: 'Seamless connection to the smart grid',
    color: 'bg-gradient-to-r from-gray-600 to-gray-800',
    href: '/features/grid'
  },
  {
    id: 'community',
    icon: UserGroupIcon,
    title: 'Community',
    description: 'Connect with other solar energy enthusiasts',
    color: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    href: '/features/community'
  },
  {
    id: 'security',
    icon: ShieldCheckIcon,
    title: 'Security',
    description: 'Blockchain-secured energy transactions',
    color: 'bg-gradient-to-r from-red-500 to-pink-500',
    href: '/features/security'
  }
];

export default function Hero() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center min-h-screen">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* CODE TYRANS Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center lg:justify-start"
            >
              <CodeTyransLogo size="lg" className="mb-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <h1 className="text-6xl lg:text-8xl font-bold text-white leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Solar Energy
                </span>
              </h1>
              <p className="text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Transform your solar investment with AI-powered forecasting, 
                decentralized trading, and smart energy management. 
                Join the renewable energy revolution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <button 
                onClick={() => setShowLoginModal(true)}
                className="group px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
              >
                Get Started Free
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="px-10 py-5 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-3 group"
              >
                <PlayIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-12 pt-12"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-white">95%</div>
                <div className="text-lg text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">₹18.5Cr</div>
                <div className="text-lg text-gray-400">Traded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">10K+</div>
                <div className="text-lg text-gray-400">Users</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Feature Cards Grid */}
            <div id="features-section" className="grid grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Link key={feature.id} href={feature.href}>
                  <motion.div
                    className={`relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer group ${
                      currentFeature === index ? 'ring-2 ring-green-400 scale-105' : ''
                    }`}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {React.createElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">{feature.description}</p>
                    
                    <div className="flex items-center text-green-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Learn More
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Active Feature Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="mt-12 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20"
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-2xl ${features[currentFeature].color} flex items-center justify-center`}>
                    {React.createElement(features[currentFeature].icon, { className: "w-10 h-10 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{features[currentFeature].title}</h3>
                    <p className="text-gray-300 text-lg">{features[currentFeature].description}</p>
                    <Link href={features[currentFeature].href}>
                      <button className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2">
                        Explore Feature
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

                  {/* Demo Modal */}
                  <DemoModal
                    isOpen={showDemoModal}
                    onClose={() => setShowDemoModal(false)}
                  />

                  {/* Chatbot */}
                  <Chatbot
                    isOpen={showChatbot}
                    onClose={() => setShowChatbot(false)}
                  />

                  {/* Floating Chatbot Button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChatbot(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
                  >
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              );
            }