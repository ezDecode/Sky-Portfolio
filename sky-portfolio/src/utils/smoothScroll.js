import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

export const smoothScrollTo = (target, duration = 1) => {
  gsap.to(window, {
    duration: duration,
    scrollTo: {
      y: target,
      offsetY: 80 // Account for fixed header
    },
    ease: "power2.inOut"
  })
}

export const smoothScrollToElement = (elementId, duration = 1) => {
  const element = document.getElementById(elementId)
  if (element) {
    smoothScrollTo(element, duration)
  }
}

// Add smooth scroll behavior to all anchor links
export const initSmoothScroll = () => {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]')
    if (target) {
      e.preventDefault()
      const targetId = target.getAttribute('href').substring(1)
      smoothScrollToElement(targetId)
    }
  })
}
