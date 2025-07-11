import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useScrollAnimation = (animationConfig) => {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const ctx = gsap.context(() => {
      gsap.fromTo(element, 
        animationConfig.from,
        {
          ...animationConfig.to,
          scrollTrigger: {
            trigger: element,
            start: animationConfig.start || "top 80%",
            end: animationConfig.end || "bottom 20%",
            toggleActions: "play none none reverse",
            ...animationConfig.scrollTrigger
          }
        }
      )
    }, element)

    return () => ctx.revert()
  }, [animationConfig])

  return elementRef
}

export const useStaggerAnimation = (selector, animationConfig) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      gsap.fromTo(container.querySelectorAll(selector),
        animationConfig.from,
        {
          ...animationConfig.to,
          stagger: animationConfig.stagger || 0.1,
          scrollTrigger: {
            trigger: container,
            start: animationConfig.start || "top 80%",
            end: animationConfig.end || "bottom 20%",
            toggleActions: "play none none reverse",
            ...animationConfig.scrollTrigger
          }
        }
      )
    }, container)

    return () => ctx.revert()
  }, [selector, animationConfig])

  return containerRef
}
