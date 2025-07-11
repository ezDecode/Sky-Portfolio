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

    // Initialize GSAP quickSetters for performance (using percentage for better scaling)
    xSetRef.current = gsap.quickSetter(flair, "xPercent")
    ySetRef.current = gsap.quickSetter(flair, "yPercent")

    // Set initial state
    gsap.set(flair, {
      scale: 0,
      xPercent: 0,
      yPercent: 0,
      transformOrigin: "0 0"
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

      // Set initial position immediately using quickSetters
      xSetRef.current(x)
      ySetRef.current(y)

      // Animate scale in with slower, more elegant timing (0.6s)
      gsap.to(flair, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      })

      // Change text color on hover with smooth transition
      gsap.to(text, {
        color: "var(--color-just-black)",
        duration: 0.6,
        ease: "cubic-bezier(0.77, 0, 0.175, 1)"
      })
    }

    const handleMouseLeave = (e) => {
      const { x, y } = getXY(e)

      // Calculate exit direction with offset (matching reference implementation)
      const exitX = x > 90 ? x + 20 : x < 10 ? x - 20 : x
      const exitY = y > 90 ? y + 20 : y < 10 ? y - 20 : y

      // Kill any existing tweens and animate out with slower timing (0.5s)
      gsap.killTweensOf(flair)
      gsap.to(flair, {
        xPercent: exitX,
        yPercent: exitY,
        scale: 0,
        duration: 0.5,
        ease: "power2.out"
      })

      // Reset text color with smooth transition
      gsap.to(text, {
        color: "var(--color-surface-white)",
        duration: 0.5,
        ease: "cubic-bezier(0.77, 0, 0.175, 1)"
      })
    }

    const handleMouseMove = (e) => {
      const { x, y } = getXY(e)

      // Smooth movement with GSAP animation (matching reference)
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      })
    }

    // Add event listeners
    button.addEventListener("mouseenter", handleMouseEnter)
    button.addEventListener("mouseleave", handleMouseLeave)
    button.addEventListener("mousemove", handleMouseMove)

    // Cleanup function
    return () => {
      if (button) {
        button.removeEventListener("mouseenter", handleMouseEnter)
        button.removeEventListener("mouseleave", handleMouseLeave)
        button.removeEventListener("mousemove", handleMouseMove)
      }
      if (flair) {
        gsap.killTweensOf(flair)
      }
      if (text) {
        gsap.killTweensOf(text)
      }
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
      {/* Magnetic flair effect - matches reference implementation */}
      <span
        ref={flairRef}
        className="absolute inset-0 pointer-events-none scale-0"
        style={{
          willChange: 'transform',
          transformOrigin: '0 0'
        }}
      >
        <span
          className="absolute block w-[170%] aspect-square bg-white rounded-full"
          style={{
            top: 0,
            left: 0,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </span>

      {/* Button label with smooth color transitions */}
      <span
        ref={textRef}
        className="relative z-10 text-center"
        style={{
          color: 'var(--color-surface-white)',
          letterSpacing: '-0.01em',
          lineHeight: '1.05',
          willChange: 'color'
        }}
      >
        {children}
      </span>
    </Component>
  )
}

export default MagneticButton
