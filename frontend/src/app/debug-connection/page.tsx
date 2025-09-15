'use client'

import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '@/config/api'

export default function DebugConnectionPage() {
  const [results, setResults] = useState<Array<{test: string, status: string, data: unknown}>>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, status: string, data: unknown) => {
    setResults(prev => [...prev, { test, status, data }])
  }

  const runAllTests = useCallback(async () => {
    setLoading(true)
    setResults([])

    // Test 1: Health Check
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
      const data = await response.json()
      addResult('Health Check', response.ok ? 'SUCCESS' : 'FAILED', data)
    } catch (error) {
      addResult('Health Check', 'ERROR', error)
    }

    // Test 2: CORS Test
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'CORS Test User',
          email: `cors-test-${Date.now()}@example.com`,
          password: 'password123',
          role: 'resident'
        }),
      })
      const data = await response.json()
      addResult('CORS Test (Register)', response.ok ? 'SUCCESS' : 'FAILED', data)
    } catch (error) {
      addResult('CORS Test (Register)', 'ERROR', error)
    }

    // Test 3: Login Test
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      })
      const data = await response.json()
      addResult('Login Test', response.ok ? 'SUCCESS' : 'FAILED', data)
    } catch (error) {
      addResult('Login Test', 'ERROR', error)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    runAllTests()
  }, [runAllTests])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Debug</h1>
        
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">
            <strong>API Base URL:</strong> {API_BASE_URL}
          </p>
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run Tests Again'}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{result.test}</h3>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  result.status === 'SUCCESS' 
                    ? 'bg-green-100 text-green-800' 
                    : result.status === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.status}
                </span>
              </div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Running tests...</p>
          </div>
        )}
      </div>
    </div>
  )
}
