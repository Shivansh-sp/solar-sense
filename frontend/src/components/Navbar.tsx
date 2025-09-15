'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/providers'
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import LoginModal from './LoginModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'About', href: '#about' },
  ]

  const handleLoginClick = () => {
    setShowLoginModal(true)
    setIsOpen(false)
  }

  // User menu removed as it was unused

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <SunIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              SolarSense
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name === 'Home' ? (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                  className="btn-outline text-sm"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                  className="btn-primary text-sm"
                >
                  Get Started
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 10 }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name === 'Home' ? (
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{item.name}</span>
                      </a>
                    )}
                  </motion.div>
                )
              })}
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    <ChartBarIcon className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ x: 10 }}
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <motion.button
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoginClick}
                    className="w-full btn-outline text-sm"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoginClick}
                    className="w-full btn-primary text-sm"
                  >
                    Get Started
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </motion.nav>
  )
}
