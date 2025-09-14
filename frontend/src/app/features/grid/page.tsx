'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  BoltIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    icon: CogIcon,
    title: 'Grid Integration',
    description: 'Seamless connection to the smart grid infrastructure',
    color: 'from-gray-600 to-gray-800'
  },
  {
    icon: BoltIcon,
    title: 'Load Balancing',
    description: 'Intelligent energy distribution and load management',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Grid Stability',
    description: 'Enhanced grid reliability and power quality',
    color: 'from-green-400 to-emerald-500'
  }
];

const benefits = [
  'Seamless grid integration',
  'Intelligent load balancing',
  'Enhanced grid stability',
  'Power quality management',
  'Automated grid responses',
  'Real-time grid monitoring'
];

export default function GridPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
              <CogIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white">Grid Integration</h1>
              <p className="text-xl text-gray-300">Seamless connection to the smart grid</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Smart Grid Connectivity</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our grid integration technology ensures seamless connection to the smart grid, 
                enabling bidirectional energy flow, load balancing, and enhanced grid stability. 
                Contribute to a more resilient and efficient energy infrastructure.
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

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
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

            <Link href="/dashboard">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-2xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Connect to Grid
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
