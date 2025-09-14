'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BoltIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import PaymentModal from './PaymentModal';

interface Trade {
  id: string;
  seller: string;
  amount: number; // kWh
  price: number; // ₹ per kWh
  total: number; // Total amount in ₹
  status: 'available' | 'pending' | 'completed' | 'cancelled';
  timestamp: string;
  description: string;
  type: 'buy' | 'sell';
}

interface TradingStats {
  currentPrice: number;
  priceChange: number;
  totalVolume: number;
  activeTrades: number;
  yourEarnings: number;
  yourSpending: number;
}

export default function TradingDashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats] = useState<TradingStats>({
    currentPrice: 6.5,
    priceChange: 2.3,
    totalVolume: 1250.5,
    activeTrades: 23,
    yourEarnings: 1250.75,
    yourSpending: 890.25
  });
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'my-trades'>('all');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTrades: Trade[] = [
      {
        id: '1',
        seller: 'SolarHouse_01',
        amount: 5.2,
        price: 6.5,
        total: 33.8,
        status: 'available',
        timestamp: '2 min ago',
        description: 'Clean solar energy from rooftop panels',
        type: 'sell'
      },
      {
        id: '2',
        seller: 'GreenEnergy_42',
        amount: 3.8,
        price: 6.2,
        total: 23.56,
        status: 'available',
        timestamp: '5 min ago',
        description: 'Excess energy from community solar farm',
        type: 'sell'
      },
      {
        id: '3',
        seller: 'EcoHome_15',
        amount: 7.1,
        price: 6.8,
        total: 48.28,
        status: 'available',
        timestamp: '8 min ago',
        description: 'High-efficiency solar panels with battery backup',
        type: 'sell'
      },
      {
        id: '4',
        seller: 'You',
        amount: 4.5,
        price: 6.3,
        total: 28.35,
        status: 'completed',
        timestamp: '1 hour ago',
        description: 'Your solar energy sold to neighbor',
        type: 'sell'
      }
    ];
    setTrades(mockTrades);
  }, []);

  const filteredTrades = trades.filter(trade => {
    if (filter === 'buy') return trade.type === 'buy';
    if (filter === 'sell') return trade.type === 'sell';
    if (filter === 'my-trades') return trade.seller === 'You';
    return true;
  });

  const handleBuyEnergy = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntent: { id: string; status: string }) => {
    console.log('Payment successful:', paymentIntent);
    // Update trade status, show success message, etc.
    setShowPaymentModal(false);
    setSelectedTrade(null);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Show error message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Energy Trading Dashboard</h1>
          <p className="text-gray-300">Buy and sell renewable energy with your community</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-white">₹{stats.currentPrice}/kWh</p>
              </div>
              <div className="flex items-center text-green-400">
                <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                <span className="text-sm">+{stats.priceChange}%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-white">{stats.totalVolume} kWh</p>
              </div>
              <BoltIcon className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Your Earnings</p>
                <p className="text-2xl font-bold text-green-400">₹{stats.yourEarnings}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Trades</p>
                <p className="text-2xl font-bold text-white">{stats.activeTrades}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Trades' },
            { key: 'buy', label: 'Buy Orders' },
            { key: 'sell', label: 'Sell Orders' },
            { key: 'my-trades', label: 'My Trades' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as 'all' | 'buy' | 'sell' | 'my-trades')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Trades List */}
        <div className="grid gap-6">
          {filteredTrades.map((trade, index) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <BoltIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{trade.seller}</h3>
                      <p className="text-gray-300 text-sm">{trade.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-white font-medium">{trade.amount} kWh</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="text-white font-medium">₹{trade.price}/kWh</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total</p>
                      <p className="text-white font-medium">₹{trade.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Time</p>
                      <p className="text-white font-medium flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {trade.timestamp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  {trade.status === 'available' && trade.seller !== 'You' && (
                    <button
                      onClick={() => handleBuyEnergy(trade)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <CreditCardIcon className="w-5 h-5" />
                      <span>Buy Energy</span>
                    </button>
                  )}
                  
                  {trade.status === 'completed' && (
                    <div className="flex items-center text-green-400">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm">Completed</span>
                    </div>
                  )}
                  
                  {trade.status === 'pending' && (
                    <div className="flex items-center text-yellow-400">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrades.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No trades found</h3>
            <p className="text-gray-300">Try adjusting your filters or check back later.</p>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedTrade?.total || 0}
        description={`Buy ${selectedTrade?.amount} kWh from ${selectedTrade?.seller}`}
        tradeId={selectedTrade?.id}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
