'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  ChartPieIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user } = useAuth()
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
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Monitor and manage your energy ecosystem
          </p>
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
