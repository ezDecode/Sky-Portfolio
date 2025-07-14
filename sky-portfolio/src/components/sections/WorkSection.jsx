/**
 * WorkSection.jsx - Clean, Simple Implementation
 * 
 * A horizontal scrolling text section with highlighted terms
 */

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Simple configuration
const TEXT_CONTENT = "My work lives at the intersection of human-centered design and robust, full-stack engineering."
const HIGHLIGHTED_TERMS = ['intersection', 'human-centered', 'engineering']

// Highlighted word styles
const HIGHLIGHT_STYLES = {
  intersection: {
    background: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
    color: '#000000',
    border: '2px solid #059669',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    opacity: 1
  },
  'human-centered': {
    background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
    color: '#000000',
    border: '2px solid #059669',
    boxShadow: '0 4px 12px rgba(132, 204, 22, 0.4)',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    opacity: 1
  },
  engineering: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ff6b35 100%)',
    color: '#000000',
    border: '2px solid #e55039',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    opacity: 1
  }
}

const WorkSection = () => {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const textContainerRef = useRef(null)
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

  // Process text into words
  const processText = () => {
    const words = TEXT_CONTENT.split(' ')
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:]$/, '')
      const isHighlighted = HIGHLIGHTED_TERMS.includes(cleanWord)
      
      return {
        id: `word-${index}`,
        text: word,
        cleanText: cleanWord,
        index,
        isHighlighted
      }
    })
  }

  const words = processText()

  // GSAP Animation
  useGSAP(() => {
    if (!sectionRef.current || !textContainerRef.current || !fontsLoaded) {
      return
    }

    const section = sectionRef.current
    const textContainer = textContainerRef.current

    // Clear existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === section) {
        trigger.kill()
      }
    })

    // Calculate scroll distance
    const containerWidth = textContainer.scrollWidth
    const viewportWidth = window.innerWidth
    const scrollDistance = Math.max(containerWidth - viewportWidth + 200, viewportWidth)

    // Create horizontal scroll animation
    gsap.to(textContainer, {
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

    // Animate words in
    const wordElements = textContainer.querySelectorAll('.work-word')
    gsap.fromTo(wordElements, 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.05,
        delay: 0.5,
        ease: 'power2.out'
      }
    )

  }, [fontsLoaded])

  return (
    <section
      ref={sectionRef}
      className="work-section"
      style={{
        height: '100vh',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        ref={containerRef}
        className="work-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          ref={textContainerRef}
          className="work-text-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            whiteSpace: 'nowrap',
            width: 'max-content',
            paddingLeft: '10vw',
            paddingRight: '10vw',
            minWidth: '400vw', // Ensure enough width
            fontFamily: 'PolySans, system-ui, sans-serif',
            fontSize: '160px',
            fontWeight: '700',
            lineHeight: '0.9',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            opacity: 1
          }}
        >
          {fontsLoaded && words.map((wordData) => {
            const isHighlighted = wordData.isHighlighted
            const highlightStyle = isHighlighted ? HIGHLIGHT_STYLES[wordData.cleanText] : {}
            
            return (
              <span
                key={wordData.id}
                className={`work-word ${isHighlighted ? 'highlighted' : ''}`}
                style={{
                  display: 'inline-block',
                  marginRight: '0.5rem',
                  color: isHighlighted ? highlightStyle.color : '#ffffff',
                  opacity: 1,
                  ...highlightStyle
                }}
              >
                {wordData.text}
              </span>
            )
          })}
        </div>
      </div>

      {/* Screen reader version */}
      <div className="sr-only">
        <h2>Work Philosophy</h2>
        <p>{TEXT_CONTENT}</p>
        <p>Key terms highlighted: {HIGHLIGHTED_TERMS.join(', ')}</p>
      </div>
    </section>
  )
}

export default WorkSection
