'use client'

import { useEffect, useRef } from 'react'
const anime = require('animejs')

interface AnimeAnimationsProps {
  children: React.ReactNode
  animationType?: 'fadeIn' | 'slideUp' | 'bounce' | 'pulse' | 'rotate' | 'scale'
  delay?: number
  duration?: number
  className?: string
}

export default function AnimeAnimations({
  children,
  animationType = 'fadeIn',
  delay = 0,
  duration = 1000,
  className = ''
}: AnimeAnimationsProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const animationConfig = {
      targets: elementRef.current,
      duration,
      delay,
      easing: 'easeOutExpo',
    }

    switch (animationType) {
      case 'fadeIn':
        anime({
          ...animationConfig,
          opacity: [0, 1],
        })
        break
      
      case 'slideUp':
        anime({
          ...animationConfig,
          translateY: [50, 0],
          opacity: [0, 1],
        })
        break
      
      case 'bounce':
        anime({
          ...animationConfig,
          translateY: [0, -20, 0],
          easing: 'easeOutBounce',
        })
        break
      
      case 'pulse':
        anime({
          ...animationConfig,
          scale: [1, 1.05, 1],
          easing: 'easeInOutQuad',
          loop: true,
        })
        break
      
      case 'rotate':
        anime({
          ...animationConfig,
          rotate: [0, 360],
          easing: 'easeInOutQuad',
        })
        break
      
      case 'scale':
        anime({
          ...animationConfig,
          scale: [0, 1],
          opacity: [0, 1],
        })
        break
      
      default:
        anime({
          ...animationConfig,
          opacity: [0, 1],
        })
    }
  }, [animationType, delay, duration])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

// Advanced Anime.js animations for complex interactions
export const createAdvancedAnimation = (element: HTMLElement, config: any) => {
  return anime({
    targets: element,
    ...config,
  })
}

// Predefined animation sequences
export const animationSequences = {
  energyFlow: (element: HTMLElement) => {
    return anime.timeline({
      targets: element,
      easing: 'easeInOutSine',
    })
    .add({
      translateX: [0, 100],
      opacity: [0, 1],
      duration: 500,
    })
    .add({
      translateX: [100, 200],
      opacity: [1, 0],
      duration: 500,
    })
  },
  
  dataVisualization: (element: HTMLElement) => {
    return anime.timeline({
      targets: element,
      easing: 'easeOutExpo',
    })
    .add({
      scale: [0, 1.1],
      duration: 300,
    })
    .add({
      scale: [1.1, 1],
      duration: 200,
    })
  },
  
  loadingSequence: (element: HTMLElement) => {
    return anime.timeline({
      targets: element,
      easing: 'easeInOutQuad',
      loop: true,
    })
    .add({
      rotate: [0, 180],
      duration: 1000,
    })
    .add({
      rotate: [180, 360],
      duration: 1000,
    })
  }
}
