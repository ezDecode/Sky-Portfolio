import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#0a0a0a',
          white: '#ffffff',
          gray: {
            light: '#1a1a1a',
            dark: '#262626',
          }
        },
        'dark-purple': '#1a1a2e',
        'dark-gray': '#0a0a0a',
      },
      fontFamily: {
        sans: ['PolySans', 'system-ui', 'sans-serif'],
        display: ['PolySans', 'system-ui', 'sans-serif'],
        editorial: ['PPEditorialNew', 'serif'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    heroui(),
    function({ addUtilities }) {
      addUtilities({
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          border: '0',
        },
        '.sr-only:focus': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: 'inherit',
          margin: 'inherit',
          overflow: 'visible',
          clip: 'auto',
          'white-space': 'normal',
        },
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
          'perspective': '1000px',
          'will-change': 'transform, opacity',
        }
      })
    }
  ],
}
