import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

const WorkSection = () => {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const textContainerRef = useRef(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Check for reduced motion preference and load fonts
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleMotionChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleMotionChange)

    // Check fonts
    const checkFonts = async () => {
      try {
        await document.fonts.ready
        setFontsLoaded(true)
      } catch (error) {
        // Fallback if font loading detection fails
        setTimeout(() => setFontsLoaded(true), 100)
      }
    }
    checkFonts()

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Enhanced horizontal scroll animation setup
  useGSAP(() => {
    if (!sectionRef.current || !containerRef.current || !textContainerRef.current || !fontsLoaded) return

    const section = sectionRef.current
    const textContainer = textContainerRef.current

    // Set initial transform with hardware acceleration
    gsap.set(textContainer, {
      force3D: true,
      willChange: 'transform'
    })

    // Skip complex animations if reduced motion is preferred
    if (reducedMotion) {
      gsap.set(textContainer, { x: 0 })
      return
    }

    // Calculate scroll distance based on content width
    const scrollDistance = textContainer.scrollWidth - window.innerWidth

    // Set up horizontal scroll animation with performance optimizations
    const scrollAnimation = gsap.to(textContainer, {
      x: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    // Handle window resize for responsive behavior
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 250)
    }

    window.addEventListener('resize', handleResize)

    // Simplified word reveal animation (only if not reduced motion)
    if (!reducedMotion) {
      // Use a timeout to ensure elements are rendered
      setTimeout(() => {
        const wordElements = textContainer.querySelectorAll('.work-text-word')

        wordElements.forEach((word) => {
          gsap.set(word, {
            opacity: 0.3,
            scale: 0.9,
            force3D: true
          })

          // Create individual scroll trigger for each word
          ScrollTrigger.create({
            trigger: word,
            start: 'left 80%',
            end: 'right 20%',
            horizontal: true,
            containerAnimation: scrollAnimation,
            onEnter: () => {
              gsap.to(word, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                force3D: true
              })
            },
            onLeave: () => {
              gsap.to(word, {
                opacity: 0.3,
                scale: 0.9,
                duration: 0.4,
                ease: 'power2.out',
                force3D: true
              })
            },
            onEnterBack: () => {
              gsap.to(word, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                force3D: true
              })
            },
            onLeaveBack: () => {
              gsap.to(word, {
                opacity: 0.3,
                scale: 0.9,
                duration: 0.4,
                ease: 'power2.out',
                force3D: true
              })
            }
          })
        })
      }, 100)
    }

    // Simplified SVG animations (only if not reduced motion)
    if (!reducedMotion) {
      setTimeout(() => {
        const svgElements = textContainer.querySelectorAll('.svg-element')

        svgElements.forEach((svg) => {
          // Set initial state for SVG elements
          gsap.set(svg, {
            opacity: 0,
            scale: 0.8,
            force3D: true
          })

          // Create simple scroll trigger for SVG entrance
          ScrollTrigger.create({
            trigger: svg,
            start: 'left 90%',
            end: 'right 10%',
            horizontal: true,
            containerAnimation: scrollAnimation,
            onEnter: () => {
              gsap.to(svg, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                force3D: true
              })
            },
            onLeave: () => {
              gsap.to(svg, {
                opacity: 0.3,
                scale: 0.8,
                duration: 0.4,
                ease: 'power2.out',
                force3D: true
              })
            },
            onEnterBack: () => {
              gsap.to(svg, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                force3D: true
              })
            },
            onLeaveBack: () => {
              gsap.to(svg, {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                ease: 'power2.out',
                force3D: true
              })
            }
          })
        })
      }, 200)
    }

    // Cleanup function
    return () => {
      if (scrollAnimation) scrollAnimation.kill()
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [fontsLoaded, reducedMotion])

  // Text content split into words for individual animation
  const textContent = "My work lives at the intersection of human-centered design and robust, full-stack engineering."
  const words = textContent.split(' ')

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work-section relative bg-white overflow-hidden"
      style={{
        height: '100vh',
        willChange: 'transform'
      }}
    >
      <div
        ref={containerRef}
        className="work-container relative w-full h-full flex items-center"
      >
        {/* Horizontal scrolling text container */}
        <div
          ref={textContainerRef}
          className="work-text-container flex items-center gap-8 whitespace-nowrap"
          style={{
            width: 'max-content',
            willChange: 'transform',
            paddingLeft: '10vw',
            paddingRight: '10vw',
            minWidth: '300vw', // Ensure 3x viewport width minimum
            transform: 'translate3d(0, 0, 0)', // Hardware acceleration
            backfaceVisibility: 'hidden' // Performance optimization
          }}
        >
          {fontsLoaded && words.map((word, index) => (
            <React.Fragment key={index}>
              {/* Simplified text word */}
              <span
                className="work-text-word work-text-content"
                data-word-index={index}
                style={{
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                  display: 'inline-block'
                }}
              >
                {word}
              </span>

              {/* Enhanced SVG elements between specific words */}
              {(index === 2 || index === 7 || index === 12 || index === 16) && (
                <div className="svg-element-container" data-svg-index={index}>
                  {/* Abstract Pattern SVG (Option C) - Rotating geometric shapes */}
                  {index === 2 && (
                    <svg
                      width="140"
                      height="140"
                      viewBox="0 0 140 140"
                      className="abstract-pattern svg-element"
                      style={{ willChange: 'transform' }}
                    >
                      <g className="rotating-group">
                        <circle
                          cx="70"
                          cy="70"
                          r="35"
                          fill="none"
                          stroke="#000"
                          strokeWidth="2"
                          className="pattern-circle"
                          opacity="0.8"
                        />
                        <rect
                          x="52.5"
                          y="52.5"
                          width="35"
                          height="35"
                          fill="none"
                          stroke="#000"
                          strokeWidth="2"
                          className="pattern-rect"
                          opacity="0.6"
                          transform="rotate(45 70 70)"
                        />
                        <polygon
                          points="70,35 95,95 45,95"
                          fill="none"
                          stroke="#000"
                          strokeWidth="2"
                          className="pattern-triangle"
                          opacity="0.7"
                        />
                        <circle
                          cx="70"
                          cy="70"
                          r="15"
                          fill="none"
                          stroke="#000"
                          strokeWidth="1"
                          className="inner-circle"
                          opacity="0.5"
                        />
                      </g>
                    </svg>
                  )}

                  {/* Line Drawing SVG (Option B) - Flowing organic lines */}
                  {index === 7 && (
                    <svg
                      width="120"
                      height="90"
                      viewBox="0 0 120 90"
                      className="line-drawing svg-element"
                      style={{ willChange: 'transform' }}
                    >
                      <path
                        d="M10,45 Q30,15 50,45 Q70,75 90,45 Q110,15 120,45"
                        fill="none"
                        stroke="#000"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="line-path-1"
                        opacity="0.8"
                      />
                      <path
                        d="M15,65 Q35,35 55,65 Q75,35 95,65"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="line-path-2"
                        opacity="0.6"
                      />
                      <path
                        d="M25,25 L95,25"
                        fill="none"
                        stroke="#000"
                        strokeWidth="1"
                        strokeLinecap="round"
                        className="line-path-3"
                        opacity="0.4"
                      />
                      <circle
                        cx="60"
                        cy="45"
                        r="4"
                        fill="#000"
                        className="line-dot"
                        opacity="0.7"
                      />
                    </svg>
                  )}

                  {/* Combined Abstract + Line SVG - Complex intersection */}
                  {index === 12 && (
                    <svg
                      width="160"
                      height="110"
                      viewBox="0 0 160 110"
                      className="combined-svg svg-element"
                      style={{ willChange: 'transform' }}
                    >
                      <path
                        d="M20,55 Q40,25 60,55 Q80,85 100,55 Q120,25 140,55"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="flowing-line"
                        opacity="0.8"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="12"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        className="floating-circle-1"
                        opacity="0.6"
                      />
                      <circle
                        cx="120"
                        cy="70"
                        r="8"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        className="floating-circle-2"
                        opacity="0.7"
                      />
                      <rect
                        x="75"
                        y="45"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#000"
                        strokeWidth="1"
                        className="intersection-rect"
                        opacity="0.5"
                        transform="rotate(30 85 55)"
                      />
                    </svg>
                  )}

                  {/* Additional Line Drawing - Minimalist curves */}
                  {index === 16 && (
                    <svg
                      width="100"
                      height="70"
                      viewBox="0 0 100 70"
                      className="minimal-lines svg-element"
                      style={{ willChange: 'transform' }}
                    >
                      <path
                        d="M10,35 Q50,10 90,35"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="curve-1"
                        opacity="0.8"
                      />
                      <path
                        d="M20,50 Q50,60 80,50"
                        fill="none"
                        stroke="#000"
                        strokeWidth="1"
                        strokeLinecap="round"
                        className="curve-2"
                        opacity="0.6"
                      />
                      <line
                        x1="50"
                        y1="20"
                        x2="50"
                        y2="50"
                        stroke="#000"
                        strokeWidth="1"
                        className="vertical-line"
                        opacity="0.5"
                      />
                    </svg>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Accessibility duplicate for screen readers */}
      <div className="sr-only">
        My work lives at the intersection of human-centered design and robust, full-stack engineering.
      </div>
    </section>
  )
}

export default WorkSection
