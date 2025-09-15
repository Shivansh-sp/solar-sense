'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface FeaturePageHeaderProps {
  title: string
  breadcrumb: string
  description?: string
}

export default function FeaturePageHeader({ 
  title, 
  breadcrumb, 
  description 
}: FeaturePageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SolarSense</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
              <span>Features</span>
              <span>/</span>
              <span className="text-green-600 font-medium">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              <ChartBarIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
