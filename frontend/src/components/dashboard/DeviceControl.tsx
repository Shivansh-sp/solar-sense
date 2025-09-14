'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CogIcon,
  PowerIcon,
  SunIcon,
  Battery0Icon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface DeviceControlProps {
  data?: {
    devices?: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
    }>;
  }
}

export default function DeviceControl({ data }: DeviceControlProps) {
  const [devices, setDevices] = useState([
    {
      id: 'device-1',
      name: 'Solar Panel Array',
      type: 'solar_panel',
      status: 'active',
      power: 8.5,
      capacity: 10.0,
      efficiency: 0.85
    },
    {
      id: 'device-2',
      name: 'Lithium-Ion Battery',
      type: 'battery',
      status: 'active',
      power: 5.2,
      capacity: 12.0,
      efficiency: 0.95
    },
    {
      id: 'device-3',
      name: 'Smart Inverter',
      type: 'inverter',
      status: 'active',
      power: 7.8,
      capacity: 10.0,
      efficiency: 0.97
    },
    {
      id: 'device-4',
      name: 'Smart Energy Meter',
      type: 'smart_meter',
      status: 'active',
      power: 0.1,
      capacity: 0,
      efficiency: 1.0
    },
    {
      id: 'device-5',
      name: 'Load Controller',
      type: 'load_controller',
      status: 'inactive',
      power: 0,
      capacity: 0,
      efficiency: 1.0
    }
  ])

  const toggleDevice = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, status: device.status === 'active' ? 'inactive' : 'active' }
        : device
    ))
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'solar_panel': return SunIcon
      case 'battery': return Battery0Icon
      case 'inverter': return PowerIcon
      case 'smart_meter': return ChartBarIcon
      case 'load_controller': return CogIcon
      default: return CogIcon
    }
  }

  const getDeviceColor = (type: string) => {
    switch (type) {
      case 'solar_panel': return 'text-yellow-600'
      case 'battery': return 'text-green-600'
      case 'inverter': return 'text-blue-600'
      case 'smart_meter': return 'text-purple-600'
      case 'load_controller': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Device Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Device Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <div className="text-sm text-gray-600">Total Devices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">22.6 kW</div>
            <div className="text-sm text-gray-600">Total Power</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Avg. Efficiency</div>
          </div>
        </div>
      </motion.div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device, index) => {
          const IconComponent = getDeviceIcon(device.type)
          const iconColor = getDeviceColor(device.type)
          
          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card p-6 ${
                device.status === 'inactive' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{device.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{device.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>

              <div className="space-y-4">
                {/* Power Output */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Power Output</span>
                  <span className="font-medium">{device.power} kW</span>
                </div>

                {/* Capacity */}
                {device.capacity > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="font-medium">{device.capacity} kW</span>
                  </div>
                )}

                {/* Efficiency */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Efficiency</span>
                  <span className="font-medium">{Math.round(device.efficiency * 100)}%</span>
                </div>

                {/* Power Bar */}
                {device.capacity > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilization</span>
                      <span className="font-medium">{Math.round((device.power / device.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${(device.power / device.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDevice(device.id)}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                  device.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {device.status === 'active' ? 'Turn Off' : 'Turn On'}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* System Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          System Alerts
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            <div>
              <div className="font-medium text-gray-900">High Power Usage</div>
              <div className="text-sm text-gray-600">Load Controller is approaching capacity</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <div className="font-medium text-gray-900">All Systems Normal</div>
              <div className="text-sm text-gray-600">No critical issues detected</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
