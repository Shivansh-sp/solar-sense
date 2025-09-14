'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
const anime = require('animejs')

interface AdvancedInteractionsProps {
  children: React.ReactNode
  className?: string
}

export default function AdvancedInteractions({ children, className = '' }: AdvancedInteractionsProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]))
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]))
  const scale = useSpring(useTransform(mouseX, [-300, 300], [0.95, 1.05]))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return
      
      const rect = elementRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = e.clientX - centerX
      const y = e.clientY - centerY
      
      setMousePosition({ x, y })
      mouseX.set(x)
      mouseY.set(y)
    }

    const element = elementRef.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
      return () => element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (elementRef.current) {
      anime({
        targets: elementRef.current,
        scale: 1.05,
        duration: 300,
        easing: 'easeOutExpo'
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (elementRef.current) {
      anime({
        targets: elementRef.current,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 300,
        easing: 'easeOutExpo'
      })
    }
  }

  return (
    <motion.div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parallax background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"
        style={{
          x: mousePosition.x * 0.1,
          y: mousePosition.y * 0.1,
        }}
      />
      
      {/* Glow effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            x: mousePosition.x * 0.2,
            y: mousePosition.y * 0.2,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Advanced particle system (ActiveTheory style)
export const ParticleSystem = ({ count = 50 }: { count?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`
        ctx.fill()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      width={typeof window !== 'undefined' ? window.innerWidth : 800}
      height={typeof window !== 'undefined' ? window.innerHeight : 600}
    />
  )
}

// Advanced scroll-triggered animations
export const ScrollTriggeredAnimation = ({ 
  children, 
  trigger = 0.5 
}: { 
  children: React.ReactNode
  trigger?: number 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (elementRef.current) {
            anime({
              targets: elementRef.current,
              translateY: [50, 0],
              opacity: [0, 1],
              duration: 800,
              easing: 'easeOutExpo',
              delay: anime.stagger(100)
            })
          }
        }
      },
      { threshold: trigger }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [trigger])

  return (
    <div ref={elementRef} className={isVisible ? 'opacity-100' : 'opacity-0'}>
      {children}
    </div>
  )
}
