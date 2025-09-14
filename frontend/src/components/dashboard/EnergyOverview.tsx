'use client'

import { motion } from 'framer-motion'
import { 
  SunIcon, 
  BoltIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

interface EnergyOverviewProps {
  data: any
}

export default function EnergyOverview({ data }: EnergyOverviewProps) {
  const stats = [
    {
      title: 'Total Generation',
      value: '52.8 kW',
      change: '+12.5%',
      changeType: 'positive',
      icon: SunIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Consumption',
      value: '45.2 kW',
      change: '+8.3%',
      changeType: 'positive',
      icon: BoltIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Grid Efficiency',
      value: '86%',
      change: '+2.1%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Energy Traded',
      value: '24.3 kWh',
      change: '+15.7%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const recentActivity = [
    {
      type: 'trade',
      message: 'Energy sold to Green Valley Home',
      amount: '5.2 kWh',
      price: '$0.78',
      time: '2 min ago',
      status: 'completed'
    },
    {
      type: 'generation',
      message: 'Solar generation peak reached',
      amount: '12.8 kW',
      time: '15 min ago',
      status: 'active'
    },
    {
      type: 'consumption',
      message: 'High consumption detected',
      amount: '8.5 kW',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      type: 'trade',
      message: 'Energy purchased from Sunshine Residence',
      amount: '3.1 kWh',
      price: '$0.47',
      time: '2 hours ago',
      status: 'completed'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Energy Flow Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Energy Flow Overview
          </h3>
          
          <div className="space-y-6">
            {/* Generation vs Consumption */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Generation</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">52.8 kW</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Consumption</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-400 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">45.2 kW</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Surplus</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-400 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">7.6 kW</span>
            </div>
          </div>

          {/* Grid Status */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Grid Status</h4>
                <p className="text-sm text-gray-600">All systems operating normally</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Stable</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'trade' ? 'bg-green-400' :
                  activity.type === 'generation' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}></div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {activity.amount && (
                      <span className="text-sm text-gray-600">{activity.amount}</span>
                    )}
                    {activity.price && (
                      <span className="text-sm text-green-600 font-medium">{activity.price}</span>
                    )}
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <div className="text-center">
              <SunIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Start Trading</div>
              <div className="text-sm text-gray-600">Sell excess energy</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="text-center">
              <BoltIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Buy Energy</div>
              <div className="text-sm text-gray-600">Purchase from neighbors</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
          >
            <div className="text-center">
              <ChartBarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Detailed insights</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
