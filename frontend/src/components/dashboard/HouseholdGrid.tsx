'use client'

import { motion } from 'framer-motion'
import { 
  SunIcon,
  BoltIcon,
  Battery0Icon,
  WifiIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface HouseholdGridProps {
  data?: {
    households?: Array<{
      id: string;
      name: string;
      status: string;
      generation: number;
      consumption: number;
    }>;
  }
}

export default function HouseholdGrid({ data }: HouseholdGridProps) {
  const households = [
    {
      id: 'household-1',
      name: 'Green Valley Home',
      status: 'online',
      generation: 8.5,
      consumption: 6.2,
      storage: 12.0,
      efficiency: 0.85,
      priority: 'normal'
    },
    {
      id: 'household-2',
      name: 'Sunshine Residence',
      status: 'online',
      generation: 12.0,
      consumption: 7.8,
      storage: 16.0,
      efficiency: 0.92,
      priority: 'normal'
    },
    {
      id: 'household-3',
      name: 'Eco District',
      status: 'online',
      generation: 6.0,
      consumption: 4.5,
      storage: 8.0,
      efficiency: 0.78,
      priority: 'normal'
    },
    {
      id: 'household-4',
      name: 'Medical Facility',
      status: 'online',
      generation: 10.0,
      consumption: 8.5,
      storage: 20.0,
      efficiency: 0.88,
      priority: 'critical'
    },
    {
      id: 'household-5',
      name: 'Smart Home Alpha',
      status: 'offline',
      generation: 0,
      consumption: 0,
      storage: 24.0,
      efficiency: 0,
      priority: 'normal'
    },
    {
      id: 'household-6',
      name: 'Community Center',
      status: 'online',
      generation: 20.0,
      consumption: 15.2,
      storage: 30.0,
      efficiency: 0.95,
      priority: 'high'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Grid Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Grid Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">6</div>
            <div className="text-sm text-gray-600">Total Households</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-sm text-gray-600">Online</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">56.5 kW</div>
            <div className="text-sm text-gray-600">Total Generation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">42.2 kW</div>
            <div className="text-sm text-gray-600">Total Consumption</div>
          </div>
        </div>
      </motion.div>

      {/* Household Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {households.map((household, index) => (
          <motion.div
            key={household.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`card p-6 ${
              household.status === 'offline' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  household.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <h4 className="font-semibold text-gray-900">{household.name}</h4>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                household.priority === 'critical' ? 'bg-red-100 text-red-800' :
                household.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {household.priority}
              </div>
            </div>

            <div className="space-y-4">
              {/* Generation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Generation</span>
                </div>
                <span className="font-medium">{household.generation} kW</span>
              </div>

              {/* Consumption */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BoltIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Consumption</span>
                </div>
                <span className="font-medium">{household.consumption} kW</span>
              </div>

              {/* Storage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery0Icon className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Storage</span>
                </div>
                <span className="font-medium">{household.storage} kWh</span>
              </div>

              {/* Efficiency */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <WifiIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Efficiency</span>
                </div>
                <span className="font-medium">{Math.round(household.efficiency * 100)}%</span>
              </div>
            </div>

            {/* Status Alert */}
            {household.status === 'offline' && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700">Offline</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
