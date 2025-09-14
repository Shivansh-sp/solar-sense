'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { 
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  SunIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

export default function Demo() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentScenario, setCurrentScenario] = useState(0)

  const scenarios = [
    {
      id: 'normal',
      title: 'Normal Day Operation',
      description: 'Standard energy trading and consumption patterns',
      duration: '24 hours',
      features: ['Solar generation', 'Load management', 'Energy trading', 'Grid stability']
    },
    {
      id: 'weather',
      title: 'Weather Change Impact',
      description: 'Simulates impact of changing weather conditions',
      duration: '12 hours',
      features: ['Cloud cover effects', 'Temperature variations', 'Wind impact', 'Adaptive pricing']
    },
    {
      id: 'outage',
      title: 'Grid Outage Simulation',
      description: 'Microgrid operation during grid outage',
      duration: '6 hours',
      features: ['Emergency protocols', 'Critical load priority', 'Battery backup', 'Island mode']
    },
    {
      id: 'peak',
      title: 'Peak Demand Period',
      description: 'High energy demand and trading activity',
      duration: '4 hours',
      features: ['Load balancing', 'Dynamic pricing', 'Peak shaving', 'Demand response']
    }
  ]

  const demoData = {
    normal: {
      households: [
        { name: 'Green Valley', generation: 8.5, consumption: 6.2, trading: 2.3 },
        { name: 'Sunshine Residence', generation: 12.0, consumption: 7.8, trading: 4.2 },
        { name: 'Eco District', generation: 6.0, consumption: 4.5, trading: 1.5 },
        { name: 'Medical Facility', generation: 10.0, consumption: 8.5, trading: 1.5 },
        { name: 'Smart Home Alpha', generation: 15.0, consumption: 9.2, trading: 5.8 },
        { name: 'Community Center', generation: 20.0, consumption: 15.2, trading: 4.8 }
      ],
      gridLoad: 45.2,
      gridSupply: 52.8,
      efficiency: 86,
      price: 0.15
    },
    weather: {
      households: [
        { name: 'Green Valley', generation: 5.2, consumption: 6.2, trading: -1.0 },
        { name: 'Sunshine Residence', generation: 7.8, consumption: 7.8, trading: 0.0 },
        { name: 'Eco District', generation: 3.5, consumption: 4.5, trading: -1.0 },
        { name: 'Medical Facility', generation: 6.2, consumption: 8.5, trading: -2.3 },
        { name: 'Smart Home Alpha', generation: 9.5, consumption: 9.2, trading: 0.3 },
        { name: 'Community Center', generation: 12.8, consumption: 15.2, trading: -2.4 }
      ],
      gridLoad: 45.2,
      gridSupply: 44.0,
      efficiency: 78,
      price: 0.18
    },
    outage: {
      households: [
        { name: 'Green Valley', generation: 8.5, consumption: 4.2, trading: 4.3 },
        { name: 'Sunshine Residence', generation: 12.0, consumption: 5.8, trading: 6.2 },
        { name: 'Eco District', generation: 6.0, consumption: 3.5, trading: 2.5 },
        { name: 'Medical Facility', generation: 10.0, consumption: 8.5, trading: 1.5 },
        { name: 'Smart Home Alpha', generation: 15.0, consumption: 6.2, trading: 8.8 },
        { name: 'Community Center', generation: 20.0, consumption: 12.8, trading: 7.2 }
      ],
      gridLoad: 40.0,
      gridSupply: 71.5,
      efficiency: 95,
      price: 0.25
    },
    peak: {
      households: [
        { name: 'Green Valley', generation: 8.5, consumption: 8.2, trading: 0.3 },
        { name: 'Sunshine Residence', generation: 12.0, consumption: 11.8, trading: 0.2 },
        { name: 'Eco District', generation: 6.0, consumption: 6.5, trading: -0.5 },
        { name: 'Medical Facility', generation: 10.0, consumption: 10.5, trading: -0.5 },
        { name: 'Smart Home Alpha', generation: 15.0, consumption: 14.2, trading: 0.8 },
        { name: 'Community Center', generation: 20.0, consumption: 18.8, trading: 1.2 }
      ],
      gridLoad: 70.0,
      gridSupply: 71.5,
      efficiency: 98,
      price: 0.22
    }
  }

  const currentData = demoData[scenarios[currentScenario].id as keyof typeof demoData]

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Interactive <span className="gradient-text">Demo</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience SolarSense in action with our interactive simulation. 
            Watch how the platform adapts to different scenarios and conditions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scenario Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Simulation Scenarios
              </h3>
              
              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <motion.button
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentScenario(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      currentScenario === index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{scenario.title}</h4>
                      <span className="text-xs text-gray-500">{scenario.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                  <span>{isPlaying ? 'Pause' : 'Start'} Simulation</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Demo Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {scenarios[currentScenario].title}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {isPlaying ? 'Running' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Grid Status */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentData.gridLoad} kW</div>
                  <div className="text-sm text-gray-600">Grid Load</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{currentData.gridSupply} kW</div>
                  <div className="text-sm text-gray-600">Grid Supply</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentData.efficiency}%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
              </div>

              {/* Household Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {currentData.households.map((household, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 mb-3">{household.name}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Generation</span>
                        <span className="font-medium">{household.generation} kW</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Consumption</span>
                        <span className="font-medium">{household.consumption} kW</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Trading</span>
                        <span className={`font-medium ${
                          household.trading > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {household.trading > 0 ? '+' : ''}{household.trading} kW
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Energy Flow Animation */}
              <div className="relative h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <SunIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-sm font-medium">Generation</div>
                      <div className="text-lg font-bold text-yellow-600">{currentData.gridSupply} kW</div>
                    </div>
                    
                    <div className="flex-1 relative">
                      <div className="h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full">
                        <motion.div
                          className="h-1 bg-white rounded-full"
                          animate={{ x: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <BoltIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-sm font-medium">Consumption</div>
                      <div className="text-lg font-bold text-blue-600">{currentData.gridLoad} kW</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Price */}
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-600 mb-1">Current Energy Price</div>
                <div className="text-3xl font-bold text-green-600">${currentData.price}/kWh</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Energy Future?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join the renewable energy revolution and start trading energy with your neighbors today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started Now
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
