'use client'

import { useState } from 'react'
import { API_BASE_URL } from '@/config/api'

export default function DebugApiPage() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status?: number;
    statusText?: string;
    data?: Record<string, unknown>;
    url: string;
    headers?: Record<string, string>;
    error?: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const testApiConnection = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      console.log('Testing API connection to:', API_BASE_URL)
      
      // Test 1: Basic connectivity
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'admin@solarsense.com', 
          password: 'admin123' 
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('Response data:', data)

      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: `${API_BASE_URL}/login`,
        headers: Object.fromEntries(response.headers.entries())
      })

    } catch (error) {
      console.error('API test error:', error)
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: `${API_BASE_URL}/login`
      })
    } finally {
      setLoading(false)
    }
  }

  const testMeEndpoint = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      console.log('Testing /me endpoint')
      
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })

      console.log('Me response status:', response.status)
      const data = await response.json()
      console.log('Me response data:', data)

      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: `${API_BASE_URL}/me`,
        headers: Object.fromEntries(response.headers.entries())
      })

    } catch (error) {
      console.error('Me endpoint test error:', error)
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: `${API_BASE_URL}/me`
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
            API Debug Page
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Configuration
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>API_BASE_URL:</strong> {API_BASE_URL}</p>
              <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
              <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={testApiConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Testing...' : 'Test Login Endpoint'}
            </button>

            <button
              onClick={testMeEndpoint}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Testing...' : 'Test /me Endpoint'}
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
                    {testResult.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                
                <div className="text-sm space-y-2">
                  <p><strong>URL:</strong> {testResult.url}</p>
                  <p><strong>Status:</strong> {testResult.status} {testResult.statusText}</p>
                  
                  {testResult.error && (
                    <p className="text-red-600">
                      <strong>Error:</strong> {testResult.error}
                    </p>
                  )}

                  {testResult.data && (
                    <div>
                      <p><strong>Response Data:</strong></p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {testResult.headers && (
                    <div>
                      <p><strong>Response Headers:</strong></p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(testResult.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
