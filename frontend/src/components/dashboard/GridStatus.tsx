'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
  SunIcon
} from '@heroicons/react/24/outline'

interface GridStatusProps {
  data: any
}

export default function GridStatus({ data }: GridStatusProps) {
  const gridMetrics = [
    {
      title: 'Grid Load',
      value: '45.2 kW',
      status: 'normal',
      change: '+5.2%',
      icon: BoltIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Grid Supply',
      value: '52.8 kW',
      status: 'excellent',
      change: '+12.5%',
      icon: SunIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Grid Efficiency',
      value: '86%',
      status: 'good',
      change: '+2.1%',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Stability Score',
      value: '94/100',
      status: 'excellent',
      change: '+1.2%',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const recentEvents = [
    {
      time: '2 min ago',
      type: 'trade',
      message: 'Energy trade completed between Green Valley and Sunshine Residence',
      status: 'success'
    },
    {
      time: '15 min ago',
      type: 'generation',
      message: 'Solar generation peak reached at 12.8 kW',
      status: 'info'
    },
    {
      time: '1 hour ago',
      type: 'load',
      message: 'Load balancing activated due to high consumption',
      status: 'warning'
    },
    {
      time: '2 hours ago',
      type: 'maintenance',
      message: 'Scheduled maintenance completed on inverter #3',
      status: 'success'
    }
  ]

  const systemAlerts = [
    {
      type: 'warning',
      title: 'High Load Period',
      message: 'Grid load approaching 80% capacity during peak hours',
      action: 'Consider load shedding'
    },
    {
      type: 'info',
      title: 'Optimal Conditions',
      message: 'All systems operating within normal parameters',
      action: 'Continue monitoring'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gridMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                metric.status === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metric.status}
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {metric.title}
            </div>
            <div className="text-sm text-green-600 font-medium">
              {metric.change}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Grid Status Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Grid Status Overview
          </h3>
          
          <div className="space-y-6">
            {/* Load vs Supply */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Load vs Supply</span>
                <span className="text-sm text-gray-600">45.2 kW / 52.8 kW</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Grid Stability */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Grid Stability</span>
                <span className="text-sm text-green-600 font-medium">Stable</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Frequency</span>
                <span className="text-sm text-gray-600">60.02 Hz</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Voltage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Voltage</span>
                <span className="text-sm text-gray-600">240.5 V</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Overall Status */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">All Systems Normal</div>
                <div className="text-sm text-gray-600">Grid operating within optimal parameters</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Events
          </h3>
          
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  event.status === 'success' ? 'bg-green-400' :
                  event.status === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`}></div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {event.message}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{event.time}</span>
                    <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          System Alerts & Recommendations
        </h3>
        
        <div className="space-y-4">
          {systemAlerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'error' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start space-x-3">
                {alert.type === 'warning' ? (
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mt-0.5" />
                ) : (
                  <CheckCircleIcon className="w-6 h-6 text-blue-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Action:</strong> {alert.action}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
