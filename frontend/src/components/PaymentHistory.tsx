'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface PaymentTransaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number; // kWh
  price: number; // ₹ per kWh
  total: number; // Total amount in ₹
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
  counterparty: string;
  description: string;
  paymentMethod: string;
  transactionId: string;
}

export default function PaymentHistory() {
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: '1',
      type: 'buy',
      amount: 5.2,
      price: 6.5,
      total: 33.8,
      status: 'completed',
      timestamp: '2 hours ago',
      counterparty: 'SolarHouse_01',
      description: 'Clean solar energy from rooftop panels',
      paymentMethod: 'Card ending in 4242',
      transactionId: 'pi_1234567890'
    },
    {
      id: '2',
      type: 'sell',
      amount: 4.5,
      price: 6.3,
      total: 28.35,
      status: 'completed',
      timestamp: '1 day ago',
      counterparty: 'GreenEnergy_42',
      description: 'Your excess solar energy sold',
      paymentMethod: 'Bank Transfer',
      transactionId: 'pi_0987654321'
    },
    {
      id: '3',
      type: 'buy',
      amount: 3.8,
      price: 6.2,
      total: 23.56,
      status: 'pending',
      timestamp: '3 hours ago',
      counterparty: 'EcoHome_15',
      description: 'High-efficiency solar panels with battery backup',
      paymentMethod: 'UPI',
      transactionId: 'pi_1122334455'
    },
    {
      id: '4',
      type: 'buy',
      amount: 7.1,
      price: 6.8,
      total: 48.28,
      status: 'failed',
      timestamp: '5 hours ago',
      counterparty: 'SolarFarm_99',
      description: 'Community solar farm energy',
      paymentMethod: 'Card ending in 1234',
      transactionId: 'pi_5566778899'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'refunded':
        return <ArrowDownIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      case 'refunded':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'buy' ? (
      <ArrowDownIcon className="w-4 h-4 text-red-400" />
    ) : (
      <ArrowUpIcon className="w-4 h-4 text-green-400" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Payment History</h2>
        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2">
          <EyeIcon className="w-4 h-4" />
          <span>View All</span>
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getTypeIcon(transaction.type)}
                    <span className="text-white font-medium">
                      {transaction.type === 'buy' ? 'Bought' : 'Sold'} Energy
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{transaction.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>From: {transaction.counterparty}</span>
                    <span>•</span>
                    <span>{transaction.paymentMethod}</span>
                    <span>•</span>
                    <span>{transaction.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-white mb-1">
                  ₹{transaction.total}
                </div>
                <div className="text-sm text-gray-400">
                  {transaction.amount} kWh @ ₹{transaction.price}/kWh
                </div>
                <div className="flex items-center justify-end mt-2">
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
            </div>

            {/* Transaction Details (Expandable) */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Transaction ID</p>
                  <p className="text-white font-mono text-xs">{transaction.transactionId}</p>
                </div>
                <div>
                  <p className="text-gray-400">Payment Method</p>
                  <p className="text-white">{transaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-400">Amount</p>
                  <p className="text-white">{transaction.amount} kWh</p>
                </div>
                <div>
                  <p className="text-gray-400">Price per kWh</p>
                  <p className="text-white">₹{transaction.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-red-400">₹{transactions.filter(t => t.type === 'buy' && t.status === 'completed').reduce((sum, t) => sum + t.total, 0)}</p>
            </div>
            <ArrowDownIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Earned</p>
              <p className="text-2xl font-bold text-green-400">₹{transactions.filter(t => t.type === 'sell' && t.status === 'completed').reduce((sum, t) => sum + t.total, 0)}</p>
            </div>
            <ArrowUpIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Net Balance</p>
              <p className="text-2xl font-bold text-white">
                ₹{transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.type === 'sell' ? t.total : -t.total), 0)}
              </p>
            </div>
            <CreditCardIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
