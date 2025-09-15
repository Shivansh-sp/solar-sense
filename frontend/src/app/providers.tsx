'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_BASE_URL } from '@/config/api'

// Types
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'operator' | 'resident'
  householdId?: string
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

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignUpData) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

interface SocketContextType {
  socket: Socket | null
  connected: boolean
}

// Contexts
const AuthContext = createContext<AuthContextType | undefined>(undefined)
const SocketContext = createContext<SocketContextType | undefined>(undefined)

// Auth Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with backend
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (userData: SignUpData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.username,
          email: userData.email,
          password: userData.password,
          role: 'resident'
        }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
      } else {
        throw new Error(data.message || 'Signup failed')
      }
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { generateGoogleAuthUrl } = await import('@/config/google-oauth')
      
      // Use redirect instead of popup to avoid SSR issues
      const authUrl = generateGoogleAuthUrl()
      
      // Store the current URL to return to after OAuth
      localStorage.setItem('oauth_return_url', window.location.pathname)
      
      // Redirect to Google OAuth
      window.location.href = authUrl
    } catch (error) {
      throw error
    }
  }

  const handleGoogleCallback = async (code: string) => {
    try {
      // Dynamic import to avoid SSR issues
      const { exchangeCodeForToken, getGoogleUserInfo } = await import('@/config/google-oauth')
      
      // Exchange code for token
      const tokenData = await exchangeCodeForToken(code)
      
      // Get user info from Google
      const googleUser = await getGoogleUserInfo(tokenData.access_token)

      // Send to backend for verification and user creation/login
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          verified: googleUser.verified_email
        }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
      } else {
        throw new Error(data.message || 'Google authentication failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Socket Provider
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
    })

    newSocket.on('connect', () => {
      setConnected(true)
      console.log('Connected to server')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
      console.log('Disconnected from server')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

// Combined Providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthProvider>
  )
}

// Hooks
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
