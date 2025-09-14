'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon, 
  ChartBarIcon, 
  BoltIcon, 
  CogIcon,
  SunIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'

// Router Context
const RouterContext = createContext<{
  currentPath: string
  navigate: (path: string) => void
}>({
  currentPath: '/',
  navigate: () => {}
})

export const useRouter = () => useContext(RouterContext)

// Navigation Component
export const Navigation = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon, path: '/' },
    { id: 'market', name: 'Trading', icon: BoltIcon, path: '/market' },
    { id: 'households', name: 'Households', icon: HomeIcon, path: '/households' },
    { id: 'devices', name: 'Devices', icon: CogIcon, path: '/devices' },
    { id: 'forecast', name: 'Forecast', icon: SunIcon, path: '/forecast' },
    { id: 'analytics', name: 'Analytics', icon: ChartPieIcon, path: '/analytics' }
  ]

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname)
    if (currentTab) {
      setActiveTab(currentTab.id)
    }
  }, [location.pathname])

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">SolarSense</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Page Transition Wrapper
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Router Provider
export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPath, setCurrentPath] = useState('/')

  const navigate = (path: string) => {
    setCurrentPath(path)
    window.history.pushState({}, '', path)
  }

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </RouterContext.Provider>
  )
}

// Route Components
export const OverviewPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Energy Overview</h1>
    <p className="text-gray-600">Monitor your energy consumption and generation in real-time.</p>
  </div>
)

export const MarketPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Energy Trading</h1>
    <p className="text-gray-600">Buy and sell energy in the decentralized marketplace.</p>
  </div>
)

export const HouseholdsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Households</h1>
    <p className="text-gray-600">Manage connected households and their energy profiles.</p>
  </div>
)

export const DevicesPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Device Control</h1>
    <p className="text-gray-600">Control and monitor your energy devices.</p>
  </div>
)

export const ForecastPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Energy Forecast</h1>
    <p className="text-gray-600">View predictions for energy generation and consumption.</p>
  </div>
)

export const AnalyticsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h1>
    <p className="text-gray-600">Detailed analytics and insights about your energy usage.</p>
  </div>
)

// Main Router Component
export default function RouterNavigation() {
  return (
    <RouterProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <PageTransition>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/households" element={<HouseholdsPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </PageTransition>
      </div>
    </RouterProvider>
  )
}
