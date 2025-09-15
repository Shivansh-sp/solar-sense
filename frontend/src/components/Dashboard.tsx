'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/app/providers'
import EnergyOverview from './dashboard/EnergyOverview'
import MarketDashboard from './dashboard/MarketDashboard'
import HouseholdGrid from './dashboard/HouseholdGrid'
import DeviceControl from './dashboard/DeviceControl'
import ForecastCharts from './dashboard/ForecastCharts'
import GridStatus from './dashboard/GridStatus'
import { Tab } from '@/types/dashboard'
import { 
  ChartBarIcon, 
  HomeIcon, 
  BoltIcon, 
  CogIcon,
  SunIcon,
  ChartPieIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<string>('overview')
  // Removed dashboardData as components now use their own data
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data removed as components now use their own data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs: Tab[] = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'market', name: 'Trading', icon: BoltIcon },
    { id: 'households', name: 'Households', icon: HomeIcon },
    { id: 'devices', name: 'Devices', icon: CogIcon },
    { id: 'forecast', name: 'Forecast', icon: SunIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartPieIcon }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <span>Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>View Landing Page</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Monitor and manage your energy ecosystem
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access to Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/features/analytics"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <ChartBarIcon className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Analytics</span>
            </Link>
            <Link
              href="/features/forecasting"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <SunIcon className="w-8 h-8 text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Forecasting</span>
            </Link>
            <Link
              href="/features/revenue"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <BoltIcon className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Revenue</span>
            </Link>
            <Link
              href="/features/smart-homes"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <HomeIcon className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Smart Homes</span>
            </Link>
            <Link
              href="/features/grid"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <CogIcon className="w-8 h-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Grid</span>
            </Link>
            <Link
              href="/features/community"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <UserIcon className="w-8 h-8 text-pink-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Community</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <EnergyOverview />}
          {activeTab === 'market' && <MarketDashboard />}
          {activeTab === 'households' && <HouseholdGrid />}
          {activeTab === 'devices' && <DeviceControl />}
          {activeTab === 'forecast' && <ForecastCharts />}
          {activeTab === 'analytics' && <GridStatus />}
        </motion.div>
      </div>
    </div>
  )
}
