'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../providers'
import LoadingScreen from '@/components/LoadingScreen'
import Dashboard from '@/components/Dashboard'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/')
    }
  }, [mounted, loading, user, router])

  if (!mounted || loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Dashboard />
      </motion.div>
    </div>
  )
}
