import React, { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const button = buttonRef.current
    const flair = flairRef.current

    if (!button || !flair) return

    const xSet = gsap.quickSetter(flair, "xPercent")
    const ySet = gsap.quickSetter(flair, "yPercent")

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
      xSet(x)
      ySet(y)
      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
    }

    const handleMouseLeave = (e) => {
      const { x, y } = getXY(e)
      gsap.killTweensOf(flair)
      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleMouseMove = (e) => {
      const { x, y } = getXY(e)
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      })
    }

    button.addEventListener("mouseenter", handleMouseEnter)
    button.addEventListener("mouseleave", handleMouseLeave)
    button.addEventListener("mousemove", handleMouseMove)

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter)
      button.removeEventListener("mouseleave", handleMouseLeave)
      button.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Base button styles
  const baseStyles = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.9375rem 1.5rem',
    borderRadius: '6.25rem',
    fontFamily: 'PolySans, system-ui, sans-serif',
    fontWeight: '400', // Regular font weight
    fontSize: '1.2rem',
    letterSpacing: '-0.01em',
    lineHeight: '1.04545',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none', // Border handled by CSS ::after pseudo-element
    backgroundColor: variant === 'stroke' ? 'transparent' : 'white',
    color: variant === 'stroke' ? 'white' : 'black',
    overflow: 'hidden',
    transition: 'color 50ms cubic-bezier(0.76, 0, 0.24, 1)'
  }

  // Determine component type
  const Component = href ? 'a' : 'button'

  return (
    <Component
      ref={buttonRef}
      href={href}
      onClick={onClick}
      className={`magnetic-button magnetic-button--${variant} ${className}`}
      style={baseStyles}
      {...props}
    >
      <span
        ref={flairRef}
        className="magnetic-button__flair"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          transform: 'scale(0)',
          transformOrigin: '0 0',
          willChange: 'transform'
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '170%',
            aspectRatio: '1/1',
            backgroundColor: variant === 'stroke' ? 'white' : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            display: 'block',
            content: '""'
          }}
        />
      </span>
      <span
        className="magnetic-button__label"
        style={{
          position: 'relative',
          textAlign: 'center',
          transition: 'color 0.15s cubic-bezier(0.76, 0, 0.24, 1)'
        }}
      >
        {children}
      </span>
    </Component>
  )
}

export default MagneticButton
