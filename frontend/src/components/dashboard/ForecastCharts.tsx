'use client'

import { motion } from 'framer-motion'
import { 
  SunIcon,
  BoltIcon,
  ChartBarIcon,
  CloudIcon
} from '@heroicons/react/24/outline'

interface ForecastChartsProps {
  data?: {
    solarForecast?: Array<{ hour: string; generation: number; irradiance: number }>;
    loadForecast?: Array<{ hour: string; load: number }>;
  }
}

export default function ForecastCharts({ data }: ForecastChartsProps) {
  const solarForecast = [
    { hour: '00:00', generation: 0, irradiance: 0 },
    { hour: '04:00', generation: 0, irradiance: 0 },
    { hour: '08:00', generation: 2.5, irradiance: 300 },
    { hour: '12:00', generation: 8.5, irradiance: 850 },
    { hour: '16:00', generation: 6.2, irradiance: 620 },
    { hour: '20:00', generation: 1.8, irradiance: 180 },
    { hour: '24:00', generation: 0, irradiance: 0 }
  ]

  const loadForecast = [
    { hour: '00:00', load: 2.5 },
    { hour: '04:00', load: 2.0 },
    { hour: '08:00', load: 4.5 },
    { hour: '12:00', load: 3.8 },
    { hour: '16:00', load: 6.2 },
    { hour: '20:00', load: 7.5 },
    { hour: '24:00', load: 3.2 }
  ]

  // Weather data removed as it was unused

  return (
    <div className="space-y-8">
      {/* Solar Generation Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Solar Generation Forecast</h3>
          <div className="flex items-center space-x-2">
            <SunIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Next 24 Hours</span>
          </div>
        </div>
        
        <div className="h-64 flex items-end space-x-2">
          {solarForecast.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t"
                style={{ height: `${(point.generation / 8.5) * 200}px` }}
              ></div>
              <div className="text-xs text-gray-500 mt-2">{point.hour}</div>
              <div className="text-xs font-medium text-gray-700">{point.generation} kW</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Load Forecast */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Load Forecast</h3>
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Next 24 Hours</span>
            </div>
          </div>
          
          <div className="h-48 flex items-end space-x-2">
            {loadForecast.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-t"
                  style={{ height: `${(point.load / 7.5) * 150}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{point.hour}</div>
                <div className="text-xs font-medium text-gray-700">{point.load} kW</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weather Conditions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weather Conditions</h3>
            <div className="flex items-center space-x-2">
              <CloudIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Current</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Temperature</span>
              <span className="text-lg font-semibold text-gray-900">28°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cloud Cover</span>
              <span className="text-lg font-semibold text-gray-900">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Humidity</span>
              <span className="text-lg font-semibold text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wind Speed</span>
              <span className="text-lg font-semibold text-gray-900">12 km/h</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <SunIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Solar Conditions</span>
            </div>
            <p className="text-sm text-gray-600">
              Excellent conditions for solar generation. High irradiance expected.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Net Energy Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Net Energy Forecast</h3>
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Generation - Consumption</span>
          </div>
        </div>
        
        <div className="h-48 flex items-end space-x-2">
          {solarForecast.map((point, index) => {
            const netEnergy = point.generation - loadForecast[index].load
            const isPositive = netEnergy > 0
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t ${
                    isPositive 
                      ? 'bg-gradient-to-t from-green-400 to-green-300' 
                      : 'bg-gradient-to-t from-red-400 to-red-300'
                  }`}
                  style={{ 
                    height: `${Math.abs(netEnergy) / 8.5 * 150}px`,
                    transform: isPositive ? 'none' : 'scaleY(-1)'
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{point.hour}</div>
                <div className={`text-xs font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netEnergy > 0 ? '+' : ''}{netEnergy.toFixed(1)} kW
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-sm text-gray-600">Energy Surplus</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-sm text-gray-600">Energy Deficit</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
