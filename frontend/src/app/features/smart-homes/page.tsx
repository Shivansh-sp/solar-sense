'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  LightBulbIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    icon: HomeIcon,
    title: 'Smart Home Integration',
    description: 'Connect and control all your home energy devices',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    icon: LightBulbIcon,
    title: 'Automated Controls',
    description: 'Intelligent energy management and device automation',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Control',
    description: 'Manage your home energy from anywhere with our app',
    color: 'from-green-400 to-emerald-500'
  }
];

const benefits = [
  'Smart home device integration',
  'Automated energy management',
  'Mobile app control',
  'Energy usage optimization',
  'Device scheduling and automation',
  'Real-time monitoring and alerts'
];

export default function SmartHomesPage() {
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white">Smart Homes</h1>
              <p className="text-xl text-gray-300">Intelligent energy management for households</p>
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
              <h2 className="text-3xl font-bold text-white">Intelligent Home Energy Management</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Transform your home into a smart energy ecosystem with our comprehensive 
                home automation platform. Control devices, optimize energy usage, and 
                enjoy seamless integration with your solar system.
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

            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Smart Home Dashboard</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-green-500/20">
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-sm text-gray-300">Connected Devices</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">85%</div>
                    <div className="text-sm text-gray-300">Energy Efficiency</div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/dashboard">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Setup Smart Home
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
