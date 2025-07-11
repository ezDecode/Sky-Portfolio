import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'

// Register GSAP plugins
gsap.registerPlugin(useGSAP, CustomEase)

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const trailRef = useRef(null)
  const isHovering = useRef(false)
  const mousePos = useRef({ x: 0, y: 0 })

  useGSAP(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    const trail = trailRef.current

    if (!cursor || !follower || !trail) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set([cursor, follower, trail], { display: 'none' })
      return
    }

    // Hide default cursor
    document.body.style.cursor = 'none'

    // Initialize cursor positions
    gsap.set([cursor, follower], {
      xPercent: -50,
      yPercent: -50,
      scale: 0
    })

    // Create trail particles
    const trailParticles = []
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div')
      particle.className = 'fixed w-1 h-1 bg-gray-900 rounded-full pointer-events-none z-[9997] mix-blend-difference'
      particle.style.transform = 'translate(-50%, -50%)'
      particle.style.willChange = 'transform, opacity'
      trail.appendChild(particle)
      trailParticles.push(particle)

      gsap.set(particle, { scale: 0, opacity: 0 })
    }

    // Entrance animation
    gsap.to([cursor, follower], {
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      stagger: 0.1
    })

    // Mouse move handler with trail effect
    const moveCursor = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Animate main cursor
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      })

      // Animate follower with delay
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out"
      })

      // Animate trail particles
      trailParticles.forEach((particle, i) => {
        gsap.to(particle, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6 + (i * 0.1),
          ease: 'power2.out',
          opacity: 1 - (i * 0.12),
          scale: 1 - (i * 0.1)
        })
      })
    }

    // Enhanced hover effects for interactive elements
    const handleMouseEnter = (e) => {
      isHovering.current = true
      const element = e.target

      // Scale up cursor
      gsap.to(cursor, {
        scale: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      })

      // Morph follower
      gsap.to(follower, {
        scale: 2.5,
        borderWidth: '1px',
        duration: 0.3,
        ease: 'power2.out'
      })

      // Add ripple effect
      const ripple = document.createElement('div')
      ripple.className = 'fixed w-16 h-16 border border-gray-900 rounded-full pointer-events-none z-[9996] mix-blend-difference'
      ripple.style.transform = 'translate(-50%, -50%)'
      ripple.style.left = mousePos.current.x + 'px'
      ripple.style.top = mousePos.current.y + 'px'
      document.body.appendChild(ripple)

      gsap.fromTo(ripple, {
        scale: 0,
        opacity: 1
      }, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      })
    }

    const handleMouseLeave = () => {
      isHovering.current = false

      // Reset cursor
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })

      // Reset follower
      gsap.to(follower, {
        scale: 1,
        borderWidth: '2px',
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    // Click effect
    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out'
      })

      // Create click particles
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div')
        particle.className = 'fixed w-2 h-2 bg-gray-900 rounded-full pointer-events-none z-[9996]'
        particle.style.left = mousePos.current.x + 'px'
        particle.style.top = mousePos.current.y + 'px'
        particle.style.transform = 'translate(-50%, -50%)'
        document.body.appendChild(particle)

        const angle = (i / 6) * Math.PI * 2
        const distance = 30

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        })
      }
    }

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.7)'
      })
    }

    // Add event listeners
    document.addEventListener('mousemove', moveCursor)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    // Cleanup
    return () => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      trailParticles.forEach(particle => particle.remove())
    }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gray-900 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          willChange: 'transform'
        }}
      />

      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-gray-900 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{
          willChange: 'transform'
        }}
      />

      {/* Trail container */}
      <div ref={trailRef} />
    </>
  )
}

export default CustomCursor
