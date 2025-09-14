'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BoltIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    icon: BoltIcon,
    title: 'Peer-to-Peer Trading',
    description: 'Trade energy directly with neighbors in your community',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Dynamic Pricing',
    description: 'Real-time market pricing based on supply and demand',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: UserGroupIcon,
    title: 'Community Marketplace',
    description: 'Connect with local energy producers and consumers',
    color: 'from-pink-500 to-rose-500'
  }
];

const benefits = [
  'Decentralized energy trading',
  'Real-time market pricing',
  'Blockchain security',
  'Community-driven marketplace',
  'Automated smart contracts',
  'Transparent transactions'
];

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-8">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <BoltIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white">Energy Trading</h1>
              <p className="text-xl text-gray-300">Decentralized peer-to-peer energy marketplace</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Revolutionary Energy Marketplace</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our decentralized energy trading platform allows you to buy and sell 
                solar energy directly with your neighbors. Using blockchain technology 
                and smart contracts, we ensure secure, transparent, and efficient 
                energy transactions that benefit both producers and consumers.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      {React.createElement(feature.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Benefits & Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Benefits List */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Key Benefits</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Live Trading Demo */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Live Trading Activity</h3>
              <div className="space-y-6">
                {/* Current Price */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
                  <div className="text-3xl font-bold text-white mb-2">$0.12/kWh</div>
                  <div className="text-sm text-gray-300">Current Market Price</div>
                  <div className="flex items-center justify-center mt-2">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">+2.3% from yesterday</span>
                  </div>
                </div>

                {/* Recent Trades */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Recent Trades</h4>
                  {[
                    { user: 'SolarHouse_01', amount: '5.2 kWh', price: '$0.62', time: '2 min ago' },
                    { user: 'GreenEnergy_42', amount: '3.8 kWh', price: '$0.46', time: '5 min ago' },
                    { user: 'EcoHome_15', amount: '7.1 kWh', price: '$0.85', time: '8 min ago' }
                  ].map((trade, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <div>
                        <div className="text-white font-medium">{trade.user}</div>
                        <div className="text-gray-400 text-sm">{trade.amount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">{trade.price}</div>
                        <div className="text-gray-400 text-sm flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {trade.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Trading Energy
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
