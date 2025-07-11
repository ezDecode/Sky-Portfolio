import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, DrawSVGPlugin, CustomEase, Physics2DPlugin)

/**
 * Advanced text reveal animations
 */
export const textAnimations = {
  // Character reveal with 3D rotation
  charReveal3D: (element, options = {}) => {
    const {
      delay = 0,
      duration = 1.5,
      stagger = 0.03,
      ease = 'power2.out'
    } = options

    const split = new SplitText(element, { type: 'chars' })
    
    gsap.set(split.chars, {
      opacity: 0,
      rotationY: -90,
      transformOrigin: '50% 50% -20px'
    })

    return gsap.to(split.chars, {
      opacity: 1,
      rotationY: 0,
      duration,
      stagger,
      ease,
      delay,
      transformOrigin: '50% 50% 0px'
    })
  },

  // Typewriter with glitch effect
  typewriterGlitch: (element, text, options = {}) => {
    const {
      speed = 50,
      glitchIntensity = 0.1,
      cursor = true
    } = options

    const tl = gsap.timeline()
    
    // Glitch effect during typing
    tl.to(element, {
      text: {
        value: text,
        delimiter: ''
      },
      duration: text.length / speed,
      ease: 'none',
      onUpdate: function() {
        if (Math.random() < glitchIntensity) {
          gsap.set(element, {
            x: gsap.utils.random(-2, 2),
            y: gsap.utils.random(-1, 1),
            duration: 0.1
          })
        }
      }
    })

    // Reset position
    tl.set(element, { x: 0, y: 0 })

    if (cursor) {
      tl.set(element, { borderRight: '2px solid currentColor' }, 0)
      tl.to(element, {
        borderRightColor: 'transparent',
        duration: 0.5,
        repeat: -1,
        yoyo: true
      }, 0)
    }

    return tl
  },

  // Word reveal with magnetic effect
  wordMagnetic: (element, options = {}) => {
    const {
      delay = 0,
      duration = 1,
      stagger = 0.1,
      magnetStrength = 20
    } = options

    const split = new SplitText(element, { type: 'words' })
    
    gsap.set(split.words, {
      opacity: 0,
      y: 50,
      filter: 'blur(10px)'
    })

    split.words.forEach(word => {
      word.addEventListener('mouseenter', () => {
        gsap.to(word, {
          scale: 1.1,
          y: -magnetStrength,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      word.addEventListener('mouseleave', () => {
        gsap.to(word, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    return gsap.to(split.words, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration,
      stagger,
      delay,
      ease: 'power2.out'
    })
  }
}

/**
 * Particle system animations
 */
export const particleAnimations = {
  // Create floating particles
  createFloatingParticles: (container, count = 50, options = {}) => {
    const {
      size = { min: 2, max: 6 },
      speed = { min: 10, max: 30 },
      opacity = { min: 0.3, max: 0.8 },
      colors = ['#ffffff', '#f0f0f0', '#e0e0e0']
    } = options

    const particles = []

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      const particleSize = gsap.utils.random(size.min, size.max)
      
      particle.style.cssText = `
        position: absolute;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background: ${gsap.utils.random(colors)};
        border-radius: 50%;
        pointer-events: none;
        opacity: ${gsap.utils.random(opacity.min, opacity.max)};
      `

      container.appendChild(particle)
      particles.push(particle)

      // Animate particle
      gsap.set(particle, {
        x: gsap.utils.random(0, container.offsetWidth),
        y: gsap.utils.random(0, container.offsetHeight)
      })

      gsap.to(particle, {
        y: `-=${gsap.utils.random(speed.min, speed.max)}`,
        x: `+=${gsap.utils.random(-20, 20)}`,
        rotation: gsap.utils.random(0, 360),
        duration: gsap.utils.random(3, 8),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    return particles
  },

  // Explosion effect
  createExplosion: (x, y, container, options = {}) => {
    const {
      particleCount = 20,
      colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
      size = 4,
      spread = 100
    } = options

    const particles = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${gsap.utils.random(colors)};
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `

      container.appendChild(particle)
      particles.push(particle)

      const angle = (i / particleCount) * Math.PI * 2
      const distance = gsap.utils.random(spread * 0.5, spread)

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: gsap.utils.random(0.5, 1.5),
        ease: 'power2.out',
        onComplete: () => {
          particle.remove()
        }
      })
    }

    return particles
  }
}

/**
 * Scroll-triggered animations
 */
export const scrollAnimations = {
  // Parallax effect
  parallax: (element, speed = 0.5, direction = 'y') => {
    return gsap.to(element, {
      [direction]: () => -(element.offsetHeight * speed),
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  },

  // Reveal on scroll
  revealOnScroll: (elements, options = {}) => {
    const {
      start = 'top 80%',
      end = 'bottom 20%',
      stagger = 0.1,
      duration = 1,
      ease = 'power2.out'
    } = options

    return gsap.fromTo(elements, {
      opacity: 0,
      y: 50,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: elements[0] || elements,
        start,
        end,
        toggleActions: 'play none none reverse'
      }
    })
  },

  // Morphing shapes on scroll
  morphOnScroll: (element, paths, options = {}) => {
    const {
      start = 'top center',
      end = 'bottom center'
    } = options

    return gsap.to(element, {
      morphSVG: paths[1],
      duration: 1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub: 1
      }
    })
  }
}

/**
 * Performance optimizations
 */
export const performanceUtils = {
  // Batch DOM reads and writes
  batchDOMOperations: (operations) => {
    return new Promise(resolve => {
      gsap.ticker.add(() => {
        operations.forEach(op => op())
        resolve()
      }, true)
    })
  },

  // Optimize for 60fps
  optimizeForPerformance: () => {
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    })

    // Use will-change for animated elements
    const animatedElements = document.querySelectorAll('[data-animate]')
    if (animatedElements.length > 0) {
      gsap.set(animatedElements, {
        willChange: 'transform, opacity'
      })
    }
  },

  // Cleanup animations
  cleanup: (elements) => {
    gsap.killTweensOf(elements)
    ScrollTrigger.getAll().forEach(trigger => {
      if (elements.includes(trigger.trigger)) {
        trigger.kill()
      }
    })
  }
}

export default {
  textAnimations,
  particleAnimations,
  scrollAnimations,
  performanceUtils
}
