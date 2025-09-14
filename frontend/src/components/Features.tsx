'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  SunIcon, 
  BoltIcon, 
  ChartBarIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  LightBulbIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const features = [
    {
      icon: SunIcon,
      title: 'AI-Powered Solar Forecasting',
      description: 'Machine learning algorithms predict solar generation with 95% accuracy using weather data, cloud cover, and historical patterns.',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: BoltIcon,
      title: 'Decentralized Energy Trading',
      description: 'Peer-to-peer marketplace where households can buy and sell excess energy in real-time with transparent pricing.',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Grid Management',
      description: 'Intelligent load balancing and grid stability control to prevent overloads and ensure reliable power distribution.',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: CpuChipIcon,
      title: 'Edge Computing',
      description: 'Local processing and decision-making for faster response times and reduced latency in critical energy operations.',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Grid Resilience',
      description: 'Microgrid capabilities ensure 100% critical load reliability during outages with automatic failover systems.',
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Environmental Impact',
      description: 'Maximize renewable energy consumption and reduce carbon footprint through intelligent energy distribution.',
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ]

  const benefits = [
    {
      icon: LightBulbIcon,
      title: 'Reduce Peak Demand',
      description: '20-30% reduction in grid peak demand through intelligent load management',
      stat: '20-30%'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Ensure Reliability',
      description: '100% critical load reliability with microgrid resilience',
      stat: '100%'
    },
    {
      icon: CogIcon,
      title: 'Maximize Efficiency',
      description: 'Optimize local solar energy consumption and storage',
      stat: '95%'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
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
            Powerful Features for
            <span className="gradient-text block">Smart Energy Management</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge technology with 
            user-friendly design to revolutionize how communities manage and 
            trade renewable energy.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center text-green-600 font-medium group"
              >
                Learn More
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Proven Results
            </h3>
            <p className="text-lg text-gray-600">
              Our platform delivers measurable improvements in energy efficiency and grid stability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <benefit.icon className="w-10 h-10 text-green-600" />
                </div>
                
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {benefit.stat}
                </div>
                
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Built with Modern Technology
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              'React 19', 'TypeScript', 'Next.js', 'Tailwind CSS',
              'Node.js', 'Express', 'MongoDB', 'WebSocket',
              'Machine Learning', 'AI/ML', 'Real-time Analytics'
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
