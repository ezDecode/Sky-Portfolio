import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const MagneticButton = ({
  children,
  className = '',
  variant = 'stroke',
  href,
  onClick,
  ...props
}) => {
  const buttonRef = useRef(null)
  const flairRef = useRef(null)
  const textRef = useRef(null)
  const xSetRef = useRef(null)
  const ySetRef = useRef(null)

  useEffect(() => {
    const button = buttonRef.current
    const flair = flairRef.current
    const text = textRef.current

    if (!button || !flair || !text) {
      return
    }

    // Initialize GSAP quickSetters for performance
    xSetRef.current = gsap.quickSetter(flair, "xPercent")
    ySetRef.current = gsap.quickSetter(flair, "yPercent")

    // Set initial state with hardware acceleration
    gsap.set(flair, {
      scale: 0,
      xPercent: 0,
      yPercent: 0,
      transformOrigin: "center center",
      force3D: true,
      willChange: "transform"
    })

    // Set initial text state
    gsap.set(text, {
      color: "var(--color-surface-white)",
      force3D: true,
      willChange: "color"
    })

    // Calculate mouse position as percentage within button bounds
    const getXY = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect()

      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      )

      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      )

      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top)
      }
    }

    const handleMouseEnter = (e) => {
      const { x, y } = getXY(e)

      // Kill any existing animations for smooth transitions
      gsap.killTweensOf([flair, text])

      // Set initial position immediately using quickSetters
      xSetRef.current(x)
      ySetRef.current(y)

      // Create timeline for coordinated animations
      const tl = gsap.timeline()

      // Animate flair scale in with optimized easing
      tl.to(flair, {
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        force3D: true
      })

      // Animate text color change simultaneously
      tl.to(text, {
        color: "var(--color-just-black)",
        duration: 0.6,
        ease: "power2.out",
        force3D: true
      }, 0) // Start at the same time as flair animation
    }

    const handleMouseLeave = (e) => {
      const { x, y } = getXY(e)

      // Calculate exit direction with enhanced offset for smoother exit
      const exitX = x > 85 ? x + 25 : x < 15 ? x - 25 : x
      const exitY = y > 85 ? y + 25 : y < 15 ? y - 25 : y

      // Kill any existing animations
      gsap.killTweensOf([flair, text])

      // Create timeline for coordinated exit animations
      const tl = gsap.timeline()

      // Animate flair out with position and scale change
      tl.to(flair, {
        xPercent: exitX,
        yPercent: exitY,
        scale: 0,
        duration: 0.5,
        ease: "power2.in",
        force3D: true
      })

      // Animate text color back simultaneously
      tl.to(text, {
        color: "var(--color-surface-white)",
        duration: 0.5,
        ease: "power2.out",
        force3D: true
      }, 0) // Start at the same time as flair animation
    }

    const handleMouseMove = (e) => {
      const { x, y } = getXY(e)

      // Only animate position if flair is visible (scale > 0)
      if (gsap.getProperty(flair, "scale") > 0) {
        // Use quickSetters for immediate response, then smooth with animation
        gsap.to(flair, {
          xPercent: x,
          yPercent: y,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto", // Prevent animation conflicts
          force3D: true
        })
      }
    }

    // Add event listeners with passive option for better performance
    button.addEventListener("mouseenter", handleMouseEnter, { passive: true })
    button.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    button.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Cleanup function with enhanced cleanup
    return () => {
      // Remove event listeners
      if (button) {
        button.removeEventListener("mouseenter", handleMouseEnter)
        button.removeEventListener("mouseleave", handleMouseLeave)
        button.removeEventListener("mousemove", handleMouseMove)
      }

      // Kill all animations and reset states
      if (flair) {
        gsap.killTweensOf(flair)
        gsap.set(flair, {
          scale: 0,
          xPercent: 0,
          yPercent: 0,
          clearProps: "willChange"
        })
      }

      if (text) {
        gsap.killTweensOf(text)
        gsap.set(text, {
          color: "var(--color-surface-white)",
          clearProps: "willChange"
        })
      }

      // Clear quickSetter references
      xSetRef.current = null
      ySetRef.current = null
    }
  }, [])

  // CSS custom properties for consistent styling
  const cssVars = {
    '--color-surface-white': '#fff',
    '--color-just-black': '#000',
    '--ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)'
  }

  // Base button classes matching reference implementation
  const baseClasses = `
    relative inline-flex items-center justify-center
    px-6 py-4 rounded-full font-regularpe text-lg
    cursor-pointer overflow-hidden
    ${className}
  `

  // Variant-specific classes - both variants now have borders
  const variantClasses = {
    filled: 'bg-black text-white border-2 border-white',
    stroke: 'bg-transparent text-white border-2 border-white'
  }

  const buttonClasses = `${baseClasses} ${variantClasses[variant]}`

  // Render as link or button based on href prop
  const Component = href ? 'a' : 'button'

  return (
    <Component
      ref={buttonRef}
      href={href}
      onClick={onClick}
      className={buttonClasses}
      style={cssVars}
      {...props}
    >
      {/* Magnetic flair effect - optimized for performance */}
      <span
        ref={flairRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          willChange: 'transform',
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <span
          className="absolute block w-[170%] aspect-square bg-white rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backfaceVisibility: 'hidden'
          }}
        />
      </span>

      {/* Button label with optimized color transitions */}
      <span
        ref={textRef}
        className="relative z-10 text-center"
        style={{
          color: 'var(--color-surface-white)',
          letterSpacing: '-0.01em',
          lineHeight: '1.05',
          willChange: 'color',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        {children}
      </span>
    </Component>
  )
}

export default MagneticButton
