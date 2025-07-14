/**
 * FeaturedProjects.jsx - Simple Project Section with Heading Only
 *
 * Features:
 * - Large heading with font-black typography
 * - GSAP animations (2s duration, sine.out easing)
 * - PolySans typography and #FFFCE1 background
 */

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

const FeaturedProjects = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Load fonts
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await document.fonts.ready
        setFontsLoaded(true)
      } catch (error) {
        console.warn('Font loading error:', error)
        setFontsLoaded(true) // Fallback
      }
    }
    loadFonts()
  }, [])

  // GSAP animations
  useGSAP(() => {
    if (!fontsLoaded) return

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(headingRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2,
          ease: "sine.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [fontsLoaded])

  return (
    <section
      id="featured-projects"
      ref={sectionRef}
      className="min-h-screen py-20 px-6 md:px-12 lg:px-20"
      style={{
        backgroundColor: '#0a0a0a',
        fontFamily: 'PolySans, system-ui, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Large Heading */}
        <div className="text-center">
          <h2
            ref={headingRef}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white"
            style={{
              fontFamily: 'PolySans, system-ui, sans-serif',
              lineHeight: '0.9',
              letterSpacing: '-0.02em',
              opacity: fontsLoaded ? 1 : 0
            }}
          >
            Featured Projects
          </h2>
        </div>
      </div>

      {/* Screen reader version */}
      <div className="sr-only">
        <h2>Featured Projects</h2>
      </div>
    </section>
  )
}

export default FeaturedProjects
