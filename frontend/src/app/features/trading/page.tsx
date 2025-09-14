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
import TradingDashboard from '@/components/TradingDashboard';

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
              <p className="text-xl text-gray-300">Decentralized peer-to-peer energy marketplace with secure payments</p>
            </div>
          </div>
        </motion.div>

        {/* Trading Dashboard */}
        <TradingDashboard />
      </div>
    </div>
  );
}
