'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyRupeeIcon, 
  LightBulbIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface OptimizationStrategy {
  id: string;
  title: string;
  description: string;
  potentialIncrease: number;
  implementation: string;
  cost: number;
  roi: number;
  category: 'pricing' | 'efficiency' | 'storage' | 'maintenance';
}

export default function RevenueOptimizationPage() {
  const [strategies, setStrategies] = useState<OptimizationStrategy[]>([]);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [optimizedRevenue, setOptimizedRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockStrategies: OptimizationStrategy[] = [
      {
        id: '1',
        title: 'Dynamic Pricing Strategy',
        description: 'Implement time-based pricing to maximize revenue during peak hours',
        potentialIncrease: 25,
        implementation: 'Adjust pricing based on demand patterns and weather forecasts',
        cost: 5000,
        roi: 300,
        category: 'pricing'
      },
      {
        id: '2',
        title: 'Battery Storage System',
        description: 'Store excess energy and sell during high-demand periods',
        potentialIncrease: 35,
        implementation: 'Install 10kWh battery system with smart charging controls',
        cost: 150000,
        roi: 180,
        category: 'storage'
      },
      {
        id: '3',
        title: 'Panel Cleaning Automation',
        description: 'Automated cleaning system to maintain optimal efficiency',
        potentialIncrease: 15,
        implementation: 'Install automated cleaning system with weather sensors',
        cost: 25000,
        roi: 250,
        category: 'maintenance'
      },
      {
        id: '4',
        title: 'Smart Inverter Upgrade',
        description: 'Upgrade to smart inverters for better grid integration',
        potentialIncrease: 20,
        implementation: 'Replace existing inverters with smart grid-compatible models',
        cost: 75000,
        roi: 200,
        category: 'efficiency'
      },
      {
        id: '5',
        title: 'Peak Hour Optimization',
        description: 'Optimize energy production during peak demand hours',
        potentialIncrease: 18,
        implementation: 'Adjust panel angles and use tracking systems',
        cost: 30000,
        roi: 220,
        category: 'efficiency'
      },
      {
        id: '6',
        title: 'Predictive Maintenance',
        description: 'AI-powered maintenance scheduling to prevent downtime',
        potentialIncrease: 12,
        implementation: 'Install IoT sensors and predictive analytics software',
        cost: 20000,
        roi: 280,
        category: 'maintenance'
      }
    ];

    const mockCurrentRevenue = 45000;
    const mockOptimizedRevenue = 58000;

    setTimeout(() => {
      setStrategies(mockStrategies);
      setCurrentRevenue(mockCurrentRevenue);
      setOptimizedRevenue(mockOptimizedRevenue);
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing': return CurrencyRupeeIcon;
      case 'efficiency': return CogIcon;
      case 'storage': return BoltIcon;
      case 'maintenance': return WrenchScrewdriverIcon;
      default: return LightBulbIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pricing': return 'bg-green-500';
      case 'efficiency': return 'bg-blue-500';
      case 'storage': return 'bg-purple-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading optimization strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revenue Optimization Strategies
          </h1>
          <p className="text-xl text-gray-600">
            Maximize your solar energy revenue with AI-powered optimization strategies
          </p>
        </motion.div>

        {/* Revenue Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Current Revenue</h2>
              <CurrencyRupeeIcon className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ₹{currentRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Monthly average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Optimized Revenue</h2>
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">
              ₹{optimizedRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-green-600">
              +₹{(optimizedRevenue - currentRevenue).toLocaleString()} potential increase
            </p>
          </motion.div>
        </div>

        {/* Optimization Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimization Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy, index) => {
              const IconComponent = getCategoryIcon(strategy.category);
              const categoryColor = getCategoryColor(strategy.category);
              
              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${categoryColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {strategy.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {strategy.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {strategy.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Potential Increase</span>
                      <span className="text-sm font-bold text-green-600">
                        +{strategy.potentialIncrease}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Implementation Cost</span>
                      <span className="text-sm font-bold text-gray-900">
                        ₹{strategy.cost.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ROI</span>
                      <span className="text-sm font-bold text-blue-600">
                        {strategy.roi}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Implementation:</strong> {strategy.implementation}
                    </p>
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Implement Strategy
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Revenue Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Peak Hour Selling</h3>
                  <p className="text-gray-600">Sell energy during 10 AM - 4 PM when demand is highest</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Weather-Based Pricing</h3>
                  <p className="text-gray-600">Adjust prices based on weather forecasts and demand patterns</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Battery Storage</h3>
                  <p className="text-gray-600">Store excess energy and sell during high-demand periods</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Regular Maintenance</h3>
                  <p className="text-gray-600">Keep panels clean and well-maintained for optimal efficiency</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}