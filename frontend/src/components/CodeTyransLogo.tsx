'use client'

import React from 'react'

interface CodeTyransLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function CodeTyransLogo({ className = '', size = 'md' }: CodeTyransLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sun with gradient */}
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FF4500" />
          </radialGradient>
          <linearGradient id="solarPanelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E8B57" />
            <stop offset="100%" stopColor="#1F4E3D" />
          </linearGradient>
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#90EE90" />
            <stop offset="100%" stopColor="#32CD32" />
          </linearGradient>
        </defs>

        {/* Sun rays */}
        <g>
          {/* Main sun rays */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * (Math.PI / 180)
            const x1 = 100 + 35 * Math.cos(angle)
            const y1 = 100 + 35 * Math.sin(angle)
            const x2 = 100 + 50 * Math.cos(angle)
            const y2 = 100 + 50 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#sunGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )
          })}
        </g>

        {/* Sun core */}
        <circle
          cx="100"
          cy="100"
          r="35"
          fill="url(#sunGradient)"
        />

        {/* Blue triangular accent behind sun */}
        <polygon
          points="120,80 140,100 120,120"
          fill="#4169E1"
          opacity="0.8"
        />

        {/* Solar Panel - Main body */}
        <g transform="translate(120, 120)">
          {/* Solar panel frame */}
          <rect
            x="0"
            y="0"
            width="60"
            height="40"
            fill="url(#frameGradient)"
            rx="2"
          />
          
          {/* Solar cells grid */}
          <g>
            {Array.from({ length: 4 }, (_, row) => 
              Array.from({ length: 6 }, (_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={col * 9 + 3}
                  y={row * 8 + 3}
                  width="7"
                  height="6"
                  fill="url(#solarPanelGradient)"
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                />
              ))
            )}
          </g>

          {/* Solar panel side edge */}
          <rect
            x="60"
            y="5"
            width="8"
            height="30"
            fill="#1F4E3D"
            rx="1"
          />
        </g>

        {/* Blue triangular accents behind solar panel */}
        <polygon
          points="180,130 200,150 180,170"
          fill="#4169E1"
          opacity="0.8"
        />
        <polygon
          points="185,135 200,150 185,165"
          fill="#1E90FF"
          opacity="0.6"
        />

        {/* Text "CODE TYRANS" */}
        <text
          x="100"
          y="190"
          textAnchor="middle"
          className="fill-orange-600 font-bold text-lg"
          style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold' }}
        >
          CODE TYRANS
        </text>
      </svg>
    </div>
  )
}
