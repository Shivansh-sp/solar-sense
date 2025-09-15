'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  SunIcon, 
  ChartBarIcon, 
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CloudIcon,
  HomeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface ForecastData {
  date: string;
  solarGeneration: number;
  revenue: number;
  weather: string;
  efficiency: number;
}

interface RevenueData {
  totalRevenue: number;
  dailyAverage: number;
  monthlyProjection: number;
  yearlyProjection: number;
  growthRate: number;
}

export default function SolarForecastingPage() {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    dailyAverage: 0,
    monthlyProjection: 0,
    yearlyProjection: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockData: ForecastData[] = [
      { date: '2024-01-15', solarGeneration: 45.2, revenue: 271.2, weather: 'Sunny', efficiency: 0.92 },
      { date: '2024-01-16', solarGeneration: 38.7, revenue: 232.2, weather: 'Partly Cloudy', efficiency: 0.88 },
      { date: '2024-01-17', solarGeneration: 52.1, revenue: 312.6, weather: 'Sunny', efficiency: 0.94 },
      { date: '2024-01-18', solarGeneration: 41.3, revenue: 247.8, weather: 'Cloudy', efficiency: 0.85 },
      { date: '2024-01-19', solarGeneration: 48.9, revenue: 293.4, weather: 'Sunny', efficiency: 0.91 },
      { date: '2024-01-20', solarGeneration: 44.6, revenue: 267.6, weather: 'Partly Cloudy', efficiency: 0.89 },
      { date: '2024-01-21', solarGeneration: 50.3, revenue: 301.8, weather: 'Sunny', efficiency: 0.93 }
    ];

    const mockRevenue: RevenueData = {
      totalRevenue: 1926.6,
      dailyAverage: 274.8,
      monthlyProjection: 8244,
      yearlyProjection: 100328,
      growthRate: 12.5
    };

    setTimeout(() => {
      setForecastData(mockData);
      setRevenueData(mockRevenue);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading forecasting data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SolarSense</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>Features</span>
                <span>/</span>
                <span className="text-green-600 font-medium">Forecasting</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solar Forecasting & Revenue Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Predict solar generation and optimize revenue with AI-powered forecasting
          </p>
        </motion.div>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{revenueData.totalRevenue.toLocaleString()}
                </p>
              </div>
              <CurrencyRupeeIcon className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{revenueData.dailyAverage.toLocaleString()}
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Projection</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{revenueData.monthlyProjection.toLocaleString()}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{revenueData.growthRate}%
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Forecasting Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7-Day Solar Generation Forecast</h2>
          <div className="space-y-4">
            {forecastData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">{day.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CloudIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{day.weather}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Generation</p>
                    <p className="font-bold">{day.solarGeneration} kWh</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-bold text-green-600">₹{day.revenue}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Efficiency</p>
                    <p className="font-bold">{Math.round(day.efficiency * 100)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Optimization Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Optimization Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Peak Hour Optimization</h3>
                  <p className="text-gray-600">Sell energy during peak hours (10 AM - 4 PM) for maximum revenue</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Weather-Based Pricing</h3>
                  <p className="text-gray-600">Adjust pricing based on weather forecasts and demand patterns</p>
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
                  <h3 className="font-semibold text-gray-900">Maintenance Schedule</h3>
                  <p className="text-gray-600">Regular cleaning and maintenance to maintain optimal efficiency</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}