'use client'

import { useState } from 'react'
import { API_BASE_URL } from '@/config/api'

export default function TestBackendPage() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    backendUrl: string;
    health?: {
      status: number;
      data: unknown;
    };
    auth?: {
      status: number;
      data: unknown;
    };
    error?: string;
    timestamp: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const testBackendConnection = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      // Test 1: Basic health check
      console.log('Testing backend connection to:', API_BASE_URL)
      
      const healthResponse = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const healthData = await healthResponse.json()

      // Test 2: Auth endpoints
      const authResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      })

      const authData = await authResponse.json()

      setTestResult({
        success: true,
        backendUrl: API_BASE_URL,
        health: {
          status: healthResponse.status,
          data: healthData
        },
        auth: {
          status: authResponse.status,
          data: authData
        },
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Backend test error:', error)
      setTestResult({
        success: false,
        backendUrl: API_BASE_URL,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Backend Connection Test
          </h1>
          
          <div className="mb-6">
            <p className="text-lg text-gray-600 mb-4">
              Current Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE_URL}</code>
            </p>
            
            <button
              onClick={testBackendConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Testing...' : 'Test Backend Connection'}
            </button>
          </div>

          {testResult && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Test Results
              </h2>
              
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${testResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </span>
                </div>
                
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Troubleshooting Steps:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Check if the backend URL is correct and accessible</li>
              <li>Verify that the backend server is running on Render</li>
              <li>Check for CORS issues between frontend and backend</li>
              <li>Verify that the backend has the required API endpoints</li>
              <li>Check the browser console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
