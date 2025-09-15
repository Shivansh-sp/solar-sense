'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  energySold: {
    total: number;
    daily: number;
    monthly: number;
    growth: number;
  };
  expenses: {
    maintenance: number;
    equipment: number;
    operational: number;
    total: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  efficiency: {
    solar: number;
    grid: number;
    overall: number;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    energySold: { total: 0, daily: 0, monthly: 0, growth: 0 },
    expenses: { maintenance: 0, equipment: 0, operational: 0, total: 0 },
    profit: { gross: 0, net: 0, margin: 0 },
    efficiency: { solar: 0, grid: 0, overall: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockData: AnalyticsData = {
      energySold: {
        total: 15420.5,
        daily: 45.2,
        monthly: 1356.8,
        growth: 8.5
      },
      expenses: {
        maintenance: 2500,
        equipment: 8500,
        operational: 1200,
        total: 12200
      },
      profit: {
        gross: 18500,
        net: 6300,
        margin: 34.1
      },
      efficiency: {
        solar: 92.5,
        grid: 88.3,
        overall: 90.4
      }
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive analysis of energy sales, expenses, and performance metrics
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Energy Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.energySold.total.toLocaleString()} kWh
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  +{analyticsData.energySold.growth}%
                </p>
              </div>
              <BoltIcon className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analyticsData.expenses.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <WrenchScrewdriverIcon className="h-8 w-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analyticsData.profit.net.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">
                  {analyticsData.profit.margin}% margin
                </p>
              </div>
              <CurrencyRupeeIcon className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.efficiency.overall}%
                </p>
                <p className="text-sm text-purple-600">System performance</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Energy Sales Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Energy Sales Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Daily Average</p>
                  <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {analyticsData.energySold.daily} kWh
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Monthly Total</p>
                  <p className="text-sm text-gray-600">Current month</p>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {analyticsData.energySold.monthly} kWh
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Growth Rate</p>
                  <p className="text-sm text-gray-600">vs last month</p>
                </div>
                <p className="text-xl font-bold text-purple-600 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
                  +{analyticsData.energySold.growth}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Expenses Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Expenses Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Maintenance</p>
                  <p className="text-sm text-gray-600">Regular upkeep</p>
                </div>
                <p className="text-xl font-bold text-red-600">
                  ₹{analyticsData.expenses.maintenance.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Equipment</p>
                  <p className="text-sm text-gray-600">New installations</p>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  ₹{analyticsData.expenses.equipment.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Operational</p>
                  <p className="text-sm text-gray-600">Daily operations</p>
                </div>
                <p className="text-xl font-bold text-yellow-600">
                  ₹{analyticsData.expenses.operational.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Efficiency Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Efficiency Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Solar Efficiency</h3>
              <p className="text-3xl font-bold text-green-600">{analyticsData.efficiency.solar}%</p>
              <p className="text-sm text-gray-600 mt-2">Panel performance</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Grid Efficiency</h3>
              <p className="text-3xl font-bold text-blue-600">{analyticsData.efficiency.grid}%</p>
              <p className="text-sm text-gray-600 mt-2">Grid integration</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Efficiency</h3>
              <p className="text-3xl font-bold text-purple-600">{analyticsData.efficiency.overall}%</p>
              <p className="text-sm text-gray-600 mt-2">System performance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}