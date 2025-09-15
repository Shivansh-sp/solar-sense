'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers'

export default function TestAuthPage() {
  const { user, login, signup, logout } = useAuth()
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      householdId?: string;
    };
    error?: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      // Test with admin credentials
      await login('admin@solarsense.com', 'admin123')
      setTestResult({
        success: true,
        message: 'Login successful with admin credentials',
        user: user || undefined
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      const testUser = {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        phoneNumber: '1234567890',
        state: 'Test State',
        district: 'Test District',
        address: 'Test Address',
        householdName: 'Test Household',
        solarCapacity: '5kW',
        batteryStorage: '10kWh',
        confirmDetails: true
      }

      await signup(testUser)
      setTestResult({
        success: true,
        message: 'Signup successful',
        user: user || undefined
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Signup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testLogout = () => {
    logout()
    setTestResult({
      success: true,
      message: 'Logout successful'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            JWT Authentication Test
          </h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current User Status
            </h2>
            {user ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  <strong>Logged in as:</strong> {user.name} ({user.email})
                </p>
                <p className="text-green-600">
                  <strong>Role:</strong> {user.role}
                </p>
                <p className="text-green-600">
                  <strong>Household ID:</strong> {user.householdId}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">Not logged in</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testLogin}
              disabled={loading || !!user}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Testing...' : 'Test Login (Admin)'}
            </button>

            <button
              onClick={testSignup}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Testing...' : 'Test Signup'}
            </button>

            <button
              onClick={testLogout}
              disabled={!user}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Logout
            </button>
          </div>

          {testResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Test Results
              </h3>
              
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${testResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.message}
                  </span>
                </div>
                
                {testResult.error && (
                  <p className="text-red-600 text-sm mt-2">
                    Error: {testResult.error}
                  </p>
                )}

                {testResult.user && (
                  <div className="mt-2">
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(testResult.user, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Test Credentials:
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Admin Login:</strong></p>
              <p>Email: admin@solarsense.com</p>
              <p>Password: admin123</p>
              <br />
              <p><strong>User Login:</strong></p>
              <p>Email: user@test.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
