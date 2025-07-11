import React, { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import SplitType from "split-type"

gsap.registerPlugin(useGSAP)

const AnimatedText = ({
  children,
  splitBy = "words",
  stagger = 0.1,
  duration = 0.8,
  ease = "sine.out",
  delay = 0,
  from = { opacity: 0 },
  to = { opacity: 1 },
  className = "",
  onComplete = () => {},
  ...props
}) => {
  const elementRef = useRef(null)

  useGSAP(() => {
    if (!elementRef.current) return

    const split = new SplitType(elementRef.current, {
      types: splitBy
    })

    let elements = []
    if (splitBy === "word") elements = split.words || []
    else if (splitBy === "lines") elements = split.lines || []
    else elements = split.words || []

    if (elements.length === 0) return

    // Set initial state with hardware acceleration
    gsap.set(elements, {
      ...from,
      // Hardware acceleration for smooth horizontal movement
      force3D: true,
      willChange: 'transform, opacity'
    })

    // Animate with optimized performance for left-to-right movement
    gsap.to(elements, {
      ...to,
      duration,
      stagger,
      ease,
      delay,
      // Ensure hardware acceleration
      force3D: true,
      willChange: 'transform, opacity',
      onComplete: () => {
        // Clean up will-change after animation
        gsap.set(elements, { willChange: 'auto' })
        onComplete()
      }
    })

    return () => split.revert()
  }, [splitBy, stagger, duration, ease, delay, from, to, onComplete])

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  )
}

export default AnimatedText
