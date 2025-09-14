'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SunIcon, 
  ChartBarIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    icon: SunIcon,
    title: 'Weather Integration',
    description: 'Real-time weather data from multiple sources for accurate predictions',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  },
  {
    icon: ChartBarIcon,
    title: 'Machine Learning Models',
    description: 'Advanced AI algorithms trained on historical solar data',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  {
    icon: ClockIcon,
    title: 'Real-time Updates',
    description: 'Continuous monitoring and prediction updates every 15 minutes',
    color: 'bg-gradient-to-r from-green-400 to-emerald-500'
  }
];

const benefits = [
  '95% prediction accuracy',
  '15-minute update intervals',
  'Weather pattern analysis',
  'Historical data integration',
  'Peak generation forecasting',
  'Cloud cover prediction'
];

export default function ForecastingPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
              <SunIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white">Solar Forecasting</h1>
              <p className="text-xl text-gray-300">AI-powered solar energy prediction</p>
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
              <h2 className="text-3xl font-bold text-white">Advanced Prediction Technology</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our solar forecasting system uses cutting-edge machine learning algorithms 
                combined with real-time weather data to provide highly accurate predictions 
                of solar energy generation. This helps you optimize your energy usage and 
                maximize your solar investment returns.
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
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0`}>
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

            {/* Demo Card */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Live Prediction Demo</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-green-500/20">
                    <div className="text-2xl font-bold text-green-400">8.5 kW</div>
                    <div className="text-sm text-gray-300">Current Generation</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">9.2 kW</div>
                    <div className="text-sm text-gray-300">Predicted Peak</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Accuracy</span>
                    <span className="text-green-400 font-semibold">95.2%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" style={{ width: '95.2%' }}></div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="text-sm">Next update in 12 minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Try Solar Forecasting
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}