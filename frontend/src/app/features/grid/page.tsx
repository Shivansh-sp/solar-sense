'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BoltIcon, 
  HomeIcon,
  SunIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface GridConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'maintenance';
  powerOutput: number;
  efficiency: number;
  lastSync: string;
  nextMaintenance: string;
}

interface RoofDetails {
  area: number;
  orientation: string;
  tilt: number;
  shading: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

interface SolarPanelConfig {
  totalPanels: number;
  panelWattage: number;
  totalWattage: number;
  inverterCapacity: number;
  batteryCapacity: number;
  estimatedGeneration: number;
}

export default function GridIntegrationPage() {
  const [gridConnections, setGridConnections] = useState<GridConnection[]>([]);
  const [roofDetails, setRoofDetails] = useState<RoofDetails>({
    area: 0,
    orientation: '',
    tilt: 0,
    shading: 0,
    condition: 'good'
  });
  const [solarConfig, setSolarConfig] = useState<SolarPanelConfig>({
    totalPanels: 0,
    panelWattage: 0,
    totalWattage: 0,
    inverterCapacity: 0,
    batteryCapacity: 0,
    estimatedGeneration: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockConnections: GridConnection[] = [
      {
        id: '1',
        name: 'Main Grid Connection',
        status: 'connected',
        powerOutput: 8500,
        efficiency: 92.5,
        lastSync: '2024-01-15 14:30',
        nextMaintenance: '2024-04-15'
      },
      {
        id: '2',
        name: 'Backup Grid Connection',
        status: 'connected',
        powerOutput: 5000,
        efficiency: 89.2,
        lastSync: '2024-01-15 14:30',
        nextMaintenance: '2024-05-01'
      }
    ];

    const mockRoofDetails: RoofDetails = {
      area: 120,
      orientation: 'South',
      tilt: 30,
      shading: 5,
      condition: 'excellent'
    };

    const mockSolarConfig: SolarPanelConfig = {
      totalPanels: 25,
      panelWattage: 400,
      totalWattage: 10000,
      inverterCapacity: 10000,
      batteryCapacity: 15000,
      estimatedGeneration: 45.2
    };

    setTimeout(() => {
      setGridConnections(mockConnections);
      setRoofDetails(mockRoofDetails);
      setSolarConfig(mockSolarConfig);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircleIcon;
      case 'disconnected': return ExclamationTriangleIcon;
      case 'maintenance': return WrenchScrewdriverIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading grid integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
                <span className="text-green-600 font-medium">Grid Integration</span>
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
            Grid Integration Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Connect and manage your solar system with the power grid
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Panels</p>
                <p className="text-2xl font-bold text-gray-900">{solarConfig.totalPanels}</p>
                <p className="text-sm text-gray-500">{solarConfig.totalWattage}W total</p>
              </div>
              <SunIcon className="h-8 w-8 text-purple-500" />
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
                <p className="text-sm font-medium text-gray-600">Roof Area</p>
                <p className="text-2xl font-bold text-gray-900">{roofDetails.area} m²</p>
                <p className="text-sm text-green-600">{roofDetails.orientation} facing</p>
              </div>
              <HomeIcon className="h-8 w-8 text-green-500" />
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
                <p className="text-sm font-medium text-gray-600">Grid Connections</p>
                <p className="text-2xl font-bold text-gray-900">{gridConnections.length}</p>
                <p className="text-sm text-blue-600">Active connections</p>
              </div>
              <BoltIcon className="h-8 w-8 text-blue-500" />
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
                <p className="text-sm font-medium text-gray-600">Daily Generation</p>
                <p className="text-2xl font-bold text-gray-900">{solarConfig.estimatedGeneration} kWh</p>
                <p className="text-sm text-orange-600">Estimated</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Roof Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Roof Details & Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <HomeIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Roof Area</p>
              <p className="text-xl font-bold text-gray-900">{roofDetails.area} m²</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <SunIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Orientation</p>
              <p className="text-xl font-bold text-gray-900">{roofDetails.orientation}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CogIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Tilt Angle</p>
              <p className="text-xl font-bold text-gray-900">{roofDetails.tilt}°</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Shading</p>
              <p className="text-xl font-bold text-gray-900">{roofDetails.shading}%</p>
            </div>
          </div>
        </motion.div>

        {/* Solar Panel Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Solar Panel Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Panel Specifications</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Panels:</span>
                  <span className="font-bold">{solarConfig.totalPanels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Panel Wattage:</span>
                  <span className="font-bold">{solarConfig.panelWattage}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Capacity:</span>
                  <span className="font-bold">{solarConfig.totalWattage}W</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Inverter & Battery</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inverter Capacity:</span>
                  <span className="font-bold">{solarConfig.inverterCapacity}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery Capacity:</span>
                  <span className="font-bold">{solarConfig.batteryCapacity}Wh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Generation:</span>
                  <span className="font-bold">{solarConfig.estimatedGeneration} kWh</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Roof Condition:</span>
                  <span className="font-bold capitalize">{roofDetails.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-bold">92.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-bold text-green-600">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Grid Connections</h2>
          <div className="space-y-4">
            {gridConnections.map((connection, index) => {
              const StatusIcon = getStatusIcon(connection.status);
              const statusColor = getStatusColor(connection.status);
              
              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-600">Connection ID: {connection.id}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="h-4 w-4" />
                        <span className="capitalize">{connection.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Power Output</p>
                      <p className="text-xl font-bold text-gray-900">{connection.powerOutput}W</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Efficiency</p>
                      <p className="text-xl font-bold text-green-600">{connection.efficiency}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Last Sync</p>
                      <p className="text-sm font-bold text-blue-600">{connection.lastSync}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Next Maintenance</p>
                      <p className="text-sm font-bold text-orange-600">{connection.nextMaintenance}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BoltIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Grid integration active
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Configure →
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