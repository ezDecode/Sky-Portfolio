import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/ui/Navigation'
import Hero from './components/sections/Hero'
import WorkSection from './components/sections/WorkSection'
import FeaturedProjects from './components/sections/FeaturedProjects'

// Register GSAP plugins
gsap.registerPlugin(useGSAP)

function App() {
  const appRef = useRef(null)

  // Initialize smooth scrolling enhancements
  useGSAP(() => {
    // Ensure smooth scrolling is properly initialized
    gsap.registerPlugin(ScrollTrigger)

    // Refresh ScrollTrigger on load to ensure proper calculations
    ScrollTrigger.refresh()

    // Enhanced smooth scrolling for better experience
    if (typeof window !== 'undefined') {
      // Set smooth scrolling on document
      document.documentElement.style.scrollBehavior = 'smooth'

      // Add momentum scrolling for webkit browsers
      document.body.style.webkitOverflowScrolling = 'touch'

      // Prevent overscroll bounce on mobile
      document.body.style.overscrollBehavior = 'none'
    }
  }, [])

  return (
    <div ref={appRef} className="min-h-screen smooth-scroll" style={{ position: 'relative', zIndex: 0, background: '#0a0a0a' }}>
      <Navigation />
      <Hero />
      <WorkSection />
      <FeaturedProjects />
    </div>
  )
}

export default App
