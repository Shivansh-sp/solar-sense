'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  SunIcon,
  BoltIcon,
  ChartBarIcon,
  CloudIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface SolarPanel {
  id: string;
  name: string;
  wattage: number;
  efficiency: number;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance: string;
  nextMaintenance: string;
  dailyGeneration: number;
  totalGeneration: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  windSpeed: number;
  condition: string;
}

interface HomeData {
  totalPanels: number;
  totalWattage: number;
  dailyGeneration: number;
  monthlyGeneration: number;
  efficiency: number;
  healthScore: number;
}

export default function SmartHomesPage() {
  const [panels, setPanels] = useState<SolarPanel[]>([]);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    humidity: 0,
    cloudCover: 0,
    uvIndex: 0,
    windSpeed: 0,
    condition: ''
  });
  const [homeData, setHomeData] = useState<HomeData>({
    totalPanels: 0,
    totalWattage: 0,
    dailyGeneration: 0,
    monthlyGeneration: 0,
    efficiency: 0,
    healthScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockPanels: SolarPanel[] = [
      {
        id: '1',
        name: 'Main Array - South',
        wattage: 5000,
        efficiency: 94.2,
        health: 'excellent',
        lastMaintenance: '2024-01-01',
        nextMaintenance: '2024-04-01',
        dailyGeneration: 42.5,
        totalGeneration: 12500
      },
      {
        id: '2',
        name: 'Secondary Array - East',
        wattage: 3000,
        efficiency: 91.8,
        health: 'good',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-04-15',
        dailyGeneration: 25.3,
        totalGeneration: 7500
      },
      {
        id: '3',
        name: 'West Array',
        wattage: 2000,
        efficiency: 88.5,
        health: 'fair',
        lastMaintenance: '2023-12-01',
        nextMaintenance: '2024-03-01',
        dailyGeneration: 16.8,
        totalGeneration: 4800
      }
    ];

    const mockWeather: WeatherData = {
      temperature: 28,
      humidity: 65,
      cloudCover: 20,
      uvIndex: 8,
      windSpeed: 12,
      condition: 'Sunny'
    };

    const mockHomeData: HomeData = {
      totalPanels: 3,
      totalWattage: 10000,
      dailyGeneration: 84.6,
      monthlyGeneration: 2538,
      efficiency: 91.5,
      healthScore: 88
    };

    setTimeout(() => {
      setPanels(mockPanels);
      setWeather(mockWeather);
      setHomeData(mockHomeData);
      setLoading(false);
    }, 1000);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return CheckCircleIcon;
      case 'good': return CheckCircleIcon;
      case 'fair': return ExclamationTriangleIcon;
      case 'poor': return ExclamationTriangleIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading home dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Homes Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Monitor your solar panel health, generation, and home energy management
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Panels</p>
                <p className="text-2xl font-bold text-gray-900">{homeData.totalPanels}</p>
                <p className="text-sm text-gray-500">{homeData.totalWattage}W total</p>
              </div>
              <HomeIcon className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Generation</p>
                <p className="text-2xl font-bold text-gray-900">{homeData.dailyGeneration} kWh</p>
                <p className="text-sm text-green-600">+5.2% vs yesterday</p>
              </div>
              <SunIcon className="h-8 w-8 text-green-500" />
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
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">{homeData.efficiency}%</p>
                <p className="text-sm text-purple-600">System average</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
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
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">{homeData.healthScore}/100</p>
                <p className="text-sm text-orange-600">Overall system</p>
              </div>
              <BoltIcon className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Weather Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Weather Conditions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CloudIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-xl font-bold text-gray-900">{weather.temperature}°C</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <SunIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">UV Index</p>
              <p className="text-xl font-bold text-gray-900">{weather.uvIndex}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CloudIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-bold text-gray-900">{weather.humidity}%</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <CloudIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Cloud Cover</p>
              <p className="text-xl font-bold text-gray-900">{weather.cloudCover}%</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <BoltIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-xl font-bold text-gray-900">{weather.windSpeed} km/h</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <SunIcon className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Condition</p>
              <p className="text-lg font-bold text-gray-900">{weather.condition}</p>
            </div>
          </div>
        </motion.div>

        {/* Solar Panel Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Solar Panel Health & Performance</h2>
          <div className="space-y-6">
            {panels.map((panel, index) => {
              const HealthIcon = getHealthIcon(panel.health);
              const healthColor = getHealthColor(panel.health);
              
              return (
                <motion.div
                  key={panel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{panel.name}</h3>
                      <p className="text-sm text-gray-600">{panel.wattage}W capacity</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${healthColor}`}>
                      <div className="flex items-center space-x-1">
                        <HealthIcon className="h-4 w-4" />
                        <span className="capitalize">{panel.health}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Efficiency</p>
                      <p className="text-xl font-bold text-gray-900">{panel.efficiency}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Daily Generation</p>
                      <p className="text-xl font-bold text-green-600">{panel.dailyGeneration} kWh</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Generation</p>
                      <p className="text-xl font-bold text-blue-600">{panel.totalGeneration} kWh</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Next Maintenance</p>
                      <p className="text-sm font-bold text-orange-600">{panel.nextMaintenance}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <WrenchScrewdriverIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Last maintenance: {panel.lastMaintenance}
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}