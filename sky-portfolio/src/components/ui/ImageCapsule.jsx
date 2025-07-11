import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const ImageCapsule = ({
  src,
  alt,
  className = '',
  animationDelay = 0,
  onLoad = () => {},
  externalAnimation = false, // New prop to disable internal animation when controlled externally
  ...props
}) => {
  const capsuleRef = useRef(null)
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Handle image loading
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageLoaded(true)
      onLoad()
    }
    img.src = src
  }, [src, onLoad])

  // GSAP entrance animation only
  useGSAP(() => {
    const capsule = capsuleRef.current
    if (!capsule || !imageLoaded) return

    // Only run internal animation if not controlled externally
    if (!externalAnimation) {
      // Set initial state for animation
      gsap.set(capsule, {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(10px)',
        rotationY: -15,
        force3D: true
      })

      // Animate in with delay to sync with text
      gsap.to(capsule, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        rotationY: 0,
        duration: 1.2,
        delay: animationDelay,
        ease: 'power2.out',
        force3D: true
      })
    }

    // No hover animations - static image capsule
  }, [imageLoaded, animationDelay, externalAnimation])

  return (
    <span
      ref={capsuleRef}
      className={`inline image-capsule ${className}`}
      style={{
        // Height to match text line height - scales with font size
        height: '1em', // Match text line height for natural integration
        // Perfect alignment with text top for better positioning
        verticalAlign: 'text-top',
        // Transparent background - no visible background
        background: 'transparent',
        // Hardware acceleration for smooth animations
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
        // Natural inline display like text characters
        display: 'inline',
        // No borders or outlines
        border: 'none',
        outline: 'none',
        // Ensure no margin/padding interference
        margin: 0,
        padding: 0,
        // Ensure inline behavior
        whiteSpace: 'nowrap'
      }}
      {...props}
    >
      {/* Image container with exact line height sizing */}
      <div
        className="relative inline"
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          height: '1em',
          width: 'auto',
          display: 'inline',
          verticalAlign: 'middle'
        }}
      >
        {imageLoaded ? (
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className=""
            role="img"
            aria-label={alt}
            style={{
              // Optimized rendering for performance
              imageRendering: 'optimizeQuality',
              WebkitImageRendering: 'optimizeQuality',
              // Hardware acceleration
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              // Prevent layout shifts
              contain: 'layout style paint',
              // Exact sizing to match text line height
              width: 'auto',
              height: '1em',
              maxHeight: '1em',
              // Ensure transparent background
              background: 'transparent',
              // No borders or styling
              border: 'none',
              outline: 'none',
              // Perfect alignment with text top for better positioning
              verticalAlign: 'text-top',
              display: 'inline',
              // No forced styling - preserve natural image appearance
              borderRadius: '0',
              boxShadow: 'none',
              // Ensure it doesn't exceed line height
              objectFit: 'contain'
            }}
            loading="eager" // Load immediately since it's above the fold
            decoding="async" // Async decoding for better performance
          />
        ) : (
          // Transparent loading placeholder
          <div
            className="h-full relative"
            style={{
              background: 'transparent',
              width: '1em', // Temporary width for loading state
              aspectRatio: '1',
              border: 'none',
              outline: 'none'
            }}
          />
        )}
      </div>
    </span>
  )
}

export default ImageCapsule
