'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, EyeIcon, EyeSlashIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../app/providers'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SignUpData {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  state: string
  district: string
  address: string
  householdName: string
  solarCapacity: string
  batteryStorage: string
  confirmDetails: boolean
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    state: '',
    district: '',
    address: '',
    householdName: '',
    solarCapacity: '',
    batteryStorage: '',
    confirmDetails: false
  })
  const { login } = useAuth()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!signUpData.confirmDetails) {
      setError('Please confirm that your energy system details are accurate')
      setLoading(false)
      return
    }

    try {
      // Here you would typically call a signup API
      // For now, we'll simulate a successful signup
      console.log('Sign up data:', signUpData)
      alert('Sign up successful! Please check your email for verification.')
      setIsSignUp(false)
      setSignUpData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        state: '',
        district: '',
        address: '',
        householdName: '',
        solarCapacity: '',
        batteryStorage: '',
        confirmDetails: false
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpChange = (field: keyof SignUpData, value: string | boolean) => {
    setSignUpData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-4 sm:p-8 w-full max-w-md mx-4 sm:mx-0 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Join SolarSense' : 'Welcome Back'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isSignUp ? 'Create your SolarSense account' : 'Sign in to your SolarSense account'}
              </p>
            </div>

            {/* Toggle between Login and Sign Up */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4 sm:mb-6">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  !isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-4 sm:space-y-6 max-h-80 sm:max-h-96 overflow-y-auto">
                {/* Personal Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={signUpData.username}
                        onChange={(e) => handleSignUpChange('username', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => handleSignUpChange('email', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signUpData.password}
                          onChange={(e) => handleSignUpChange('password', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10 sm:pr-12 text-sm sm:text-base"
                          placeholder="Enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => handleSignUpChange('confirmPassword', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={signUpData.phoneNumber}
                      onChange={(e) => handleSignUpChange('phoneNumber', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Location Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={signUpData.state}
                        onChange={(e) => handleSignUpChange('state', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <input
                        type="text"
                        value={signUpData.district}
                        onChange={(e) => handleSignUpChange('district', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter district"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={signUpData.address}
                      onChange={(e) => handleSignUpChange('address', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Enter full address"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Energy System Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Energy System Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Household Name *
                    </label>
                    <input
                      type="text"
                      value={signUpData.householdName}
                      onChange={(e) => handleSignUpChange('householdName', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Enter household name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solar Capacity (kW) *
                      </label>
                      <input
                        type="number"
                        value={signUpData.solarCapacity}
                        onChange={(e) => handleSignUpChange('solarCapacity', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="e.g., 5000"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Battery Storage (kWh) *
                      </label>
                      <input
                        type="number"
                        value={signUpData.batteryStorage}
                        onChange={(e) => handleSignUpChange('batteryStorage', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="e.g., 10"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl">
                    <input
                      type="checkbox"
                      id="confirmDetails"
                      checked={signUpData.confirmDetails}
                      onChange={(e) => handleSignUpChange('confirmDetails', e.target.checked)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded flex-shrink-0"
                      required
                    />
                    <label htmlFor="confirmDetails" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      I confirm that the energy system details provided above are accurate and complete. 
                      I understand that incorrect information may affect the performance of SolarSense services.
                    </label>
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                     <input
                       type={showPassword ? 'text' : 'password'}
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10 sm:pr-12 text-sm sm:text-base"
                       placeholder="Enter your password"
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                     >
                       {showPassword ? (
                         <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                       ) : (
                         <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                       )}
                     </button>
                  </div>
                </div>

                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                 >
                   {loading ? 'Signing In...' : 'Sign In'}
                 </button>
              </form>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base">
                {error}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
