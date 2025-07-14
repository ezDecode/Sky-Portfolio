import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroVideo from '../../assets/images/Hero.webm'
import ContainerTextFlip from '../ui/ContainerTextFlip'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

const Hero = () => {
  const heroRef = useRef(null)
  const textRef = useRef(null)
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Wait for fonts to load before starting animations
  useEffect(() => {
    const checkFonts = async () => {
      try {
        await document.fonts.ready
        setFontsLoaded(true)
      } catch {
        // Fallback if font loading detection fails
        setTimeout(() => setFontsLoaded(true), 100)
      }
    }
    checkFonts()
  }, [])

  // Ensure video loops properly with debugging
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      console.log('Video ended, restarting...')
      video.currentTime = 0
      video.play()
    }

    const handleVideoLoad = () => {
      console.log('Video loaded successfully')
      video.loop = true
      video.muted = true
      video.play().catch(error => {
        console.error('Video play failed:', error)
      })
    }

    const handleVideoError = (e) => {
      console.error('Video error:', e)
    }

    const handleCanPlay = () => {
      console.log('Video can play')
    }

    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('loadeddata', handleVideoLoad)
    video.addEventListener('error', handleVideoError)
    video.addEventListener('canplay', handleCanPlay)

    // Try to load the video immediately
    video.load()

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('loadeddata', handleVideoLoad)
      video.removeEventListener('error', handleVideoError)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  // Enhanced Hero section animations with smooth scrolling
  useGSAP(() => {
    if (!heroRef.current || !textRef.current || !sectionRef.current || !videoRef.current || !fontsLoaded) return

    const hero = heroRef.current
    const text = textRef.current
    const section = sectionRef.current
    const video = videoRef.current

    // Set initial state with hardware acceleration
    gsap.set([hero, text], {
      opacity: 0,
      y: 30,
      scale: 0.98,
      filter: 'blur(3px)',
      force3D: true,
      willChange: 'transform, opacity, filter'
    })

    // Set initial state for video background - make it visible by default
    gsap.set(video, {
      opacity: 0.8,
      scale: 1,
      filter: 'blur(0px)',
      force3D: true,
      willChange: 'transform, opacity, filter'
    })

    // Create timeline for coordinated animations
    const tl = gsap.timeline({
      defaults: {
        ease: 'sine.out',
        force3D: true
      }
    })

    // Video background entrance (first, visible)
    tl.to(video, {
      opacity: 0.8,
      scale: 1,
      filter: 'blur(0px)',
      duration: 2.5,
      delay: 0.1,
      clearProps: 'willChange'
    })

    // Hero entrance animation
    tl.to(hero, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 2,
      delay: 0.3,
      clearProps: 'willChange'
    }, '-=2.2')

    // Text entrance with slight delay
    tl.to(text, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.8,
      clearProps: 'willChange'
    }, '-=1.5')

    // Add smooth parallax scroll effect for text
    gsap.to(text, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    })

    // Add subtle scale effect on scroll for hero content
    gsap.to(hero, {
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
        invalidateOnRefresh: true
      }
    })

    // Add parallax effect for video background
    gsap.to(video, {
      y: -30,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    })

    // Cleanup
    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [fontsLoaded])

  return (
    <section
      id="hero"
      ref={sectionRef}
      role="banner"
      aria-label="Hero section introducing Akash, web developer"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a',
        paddingTop: '80px', // Account for navbar
        paddingBottom: '40px', // Ensure bottom spacing
        willChange: 'transform'
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute object-cover"
        style={{
          top: 'calc(5% + 80px)', // Account for navbar height + 5% spacing
          left: '5%',
          width: '90%',
          height: 'calc(90% - 80px)', // Adjust height to maintain proportions
          zIndex: 10,
          opacity: 0.8,
          willChange: 'transform, opacity, filter',
          borderRadius: '12px'
        }}
        aria-hidden="true"
        onError={(e) => console.error('Video element error:', e)}
        onLoadStart={() => console.log('Video load started')}
        onLoadedData={() => console.log('Video data loaded')}
      >
        <source src="/Hero.webm" type="video/webm" />
        <source src={HeroVideo} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to ensure text readability - temporarily disabled for testing */}
      {/* <div
        className="absolute inset-0 bg-black bg-opacity-5"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      /> */}
      <div
        ref={heroRef}
        className="w-full flex items-center justify-center relative"
        style={{
          minHeight: 'calc(100vh - 120px)', // Account for navbar and padding
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20 // Ensure content appears above video but below navbar
        }}
      >
        {/* Hero Text - Main Heading and Subheading */}
        <div
          ref={textRef}
          className="font-black text-white leading-[0.9] tracking-tight text-center"
          aria-hidden="true"
          style={{
            fontFamily: 'PolySans, system-ui, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem', // Larger gap between main heading and subheading
            lineHeight: '1.1',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' // Add text shadow for better readability
          }}
        >
          {fontsLoaded && (
            <div className="hero-text-container">
              {/* Main Heading with Container Text Flip */}
              <div className="hero-main-heading flex items-center justify-center gap-4" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}>
                <ContainerTextFlip
                  words={["Hey, Akash Here!", "Creative sky"]}
                  interval={4000}
                  animationDuration={1000}
                  className="bg-transparent shadow-none dark:bg-transparent dark:shadow-none text-white font-black"
                  textClassName="font-black"
                  style={{
                    fontFamily: 'PolySans, system-ui, sans-serif',
                    fontSize: 'clamp(3rem, 8vw, 8rem)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>


            </div>
          )}
        </div>

        {/* Screen reader accessible content following GSAP's recommended approach */}
        <div className="sr-only">
          <h1>Hey, Akash Here - Creative sky</h1>
          <p>Welcome to my portfolio showcasing web development projects focused on clarity and performance.</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
