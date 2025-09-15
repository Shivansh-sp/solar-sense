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
  const { login, signup, loginWithGoogle } = useAuth()

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
      await signup(signUpData)
      onClose()
      // Reset form
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

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      await loginWithGoogle()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
    } finally {
      setLoading(false)
    }
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

            {/* Google OAuth Button */}
            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mt-4 w-full flex justify-center items-center px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>

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
