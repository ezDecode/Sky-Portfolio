import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import AnimatedText from '../ui/AnimatedText'
import ImageCapsule from '../ui/ImageCapsule'
import HeaderImage from '../../assets/images/HeaderImage.png'

const Hero = () => {
  const heroRef = useRef(null)
  const textRef = useRef(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Wait for fonts to load before starting animations
  useEffect(() => {
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
  }, [])

  // Hero section entrance animation
  useGSAP(() => {
    if (!heroRef.current || !fontsLoaded) return

    // Set initial state
    gsap.set(heroRef.current, {
      opacity: 0,
      y: 20
    })

    // Animate hero section in
    gsap.to(heroRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.3
    })
  }, [fontsLoaded])

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundColor: '#FFFCE1',
        paddingTop: '80px', // Account for navbar
        paddingBottom: '40px' // Ensure bottom spacing
      }}
    >
      <div
        ref={heroRef}
        className="w-full flex items-center justify-center"
        style={{
          minHeight: 'calc(100vh - 120px)', // Account for navbar and padding
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Hero Text with Integrated Image Capsule */}
        <div
          ref={textRef}
          className="font-bold text-black leading-[0.9] tracking-tight text-center hero-text-dynamic hero-text-responsive"
          style={{
            fontFamily: 'PolySans, system-ui, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2em' // Small gap between lines
          }}
        >
          {fontsLoaded && (
            <div className="hero-text-container">
              {/* First line: "Hey, I'm Akash [image] shaping web" */}
              <div className="hero-line-1 block">
                <AnimatedText
                  splitBy="words"
                  stagger={0.1}
                  duration={2}
                  ease="sine.out"
                  delay={0.8}
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  className="inline"
                >
                  Hey, I'm Akash
                </AnimatedText>
                {' '}
                <ImageCapsule
                  src={HeaderImage}
                  alt="Header AI Gen. Image"
                  className=""
                  animationDelay={1.5}
                  externalAnimation={false}
                  onLoad={() => console.log('HeaderImage loaded successfully')}
                />
                {' '}
                <AnimatedText
                  splitBy="words"
                  stagger={0.1}
                  duration={2}
                  ease="sine.out"
                  delay={1.0}
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  className="inline"
                >
                  shaping web
                </AnimatedText>
              </div>

              {/* Second line: "experiences where clarity meets speed." */}
              <div className="hero-line-2 block">
                <AnimatedText
                  splitBy="words"
                  stagger={0.1}
                  duration={2}
                  ease="sine.out"
                  delay={1.2}
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  className="inline"
                >
                  experiences where clarity meets speed.
                </AnimatedText>
              </div>
            </div>
          )}
        </div>

        {/* Accessibility duplicate for screen readers */}
        <div className="sr-only">
          Hey, I'm Akash shaping web experiences where clarity meets speed.
        </div>
      </div>
    </section>
  )
}

export default Hero
