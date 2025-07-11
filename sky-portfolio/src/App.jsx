import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Navigation from './components/ui/Navigation'
import Hero from './components/sections/Hero'
import WorkSection from './components/sections/WorkSection'
import CustomCursor from './components/ui/CustomCursor'

// Register GSAP plugins
gsap.registerPlugin(useGSAP)

function App() {
  const appRef = useRef(null)

  return (
    <div ref={appRef} className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <WorkSection />
      <CustomCursor />
    </div>
  )
}

export default App
