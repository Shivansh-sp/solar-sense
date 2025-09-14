'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    icon: ChartBarIcon,
    title: 'Real-time Monitoring',
    description: 'Live energy consumption and production tracking',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: ChartPieIcon,
    title: 'Detailed Analytics',
    description: 'Comprehensive insights into your energy patterns',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: ArrowTrendingUpIcon,
    title: 'Performance Trends',
    description: 'Historical data analysis and future predictions',
    color: 'from-pink-500 to-rose-500'
  }
];

const benefits = [
  'Real-time energy monitoring',
  'Detailed consumption analytics',
  'Performance trend analysis',
  'Cost optimization insights',
  'Efficiency recommendations',
  'Custom reporting dashboard'
];

export default function AnalyticsPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white">Smart Analytics</h1>
              <p className="text-xl text-gray-300">Real-time energy insights and optimization</p>
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
              <h2 className="text-3xl font-bold text-white">Comprehensive Energy Intelligence</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our advanced analytics platform provides deep insights into your energy 
                consumption and production patterns. Monitor performance in real-time, 
                identify optimization opportunities, and make data-driven decisions 
                to maximize your solar investment returns.
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

            {/* Analytics Demo */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Live Analytics Dashboard</h3>
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-green-500/20">
                    <div className="text-2xl font-bold text-green-400">85%</div>
                    <div className="text-sm text-gray-300">Efficiency</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">$127</div>
                    <div className="text-sm text-gray-300">Saved Today</div>
                  </div>
                </div>

                {/* Energy Flow */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Energy Flow</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Generated</span>
                      <span className="text-green-400 font-semibold">8.5 kWh</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Consumed</span>
                      <span className="text-blue-400 font-semibold">6.2 kWh</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Recent Activity</h4>
                  {[
                    { action: 'Peak generation reached', time: '2:30 PM', value: '8.5 kW' },
                    { action: 'Energy sold to grid', time: '1:45 PM', value: '2.3 kWh' },
                    { action: 'Efficiency optimization', time: '12:15 PM', value: '+5%' }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <div>
                        <div className="text-white text-sm">{activity.action}</div>
                        <div className="text-gray-400 text-xs flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                      <div className="text-green-400 font-semibold text-sm">{activity.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-2xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
                View Analytics Dashboard
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
