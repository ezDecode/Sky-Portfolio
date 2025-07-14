import { useState, useEffect, useRef } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from '@heroui/react'
import { gsap } from 'gsap'
import MagneticButton from './MagneticButton'
import DoodleImageNav from '../../assets/images/DoodleImageNav.png'

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navRef = useRef(null)
  // Custom scroll hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 100 // Start hiding after 100px scroll

      if (currentScrollY < scrollThreshold) {
        // Always show navbar at the top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // Scrolling down - hide navbar
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  // GSAP animation for navbar visibility
  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }, [isVisible])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContactClick = () => {
    window.open('mailto:ezdecode@gmail.com', '_blank')
  }

  const menuItems = [
    { name: "Projects", id: "featured-projects" },
    { name: "Skills", id: "skills" }
  ]

  return (
    <div
      ref={navRef}
      className="navbar-container fixed top-4 sm:top-6 left-0 right-0 z-[9999] flex justify-center"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <Navbar
        position="static"
        maxWidth="full"
        height="auto"
        className="navbar-transparent"
        classNames={{
          base: "bg-transparent p-0 !bg-transparent relative",
          wrapper: "w-full max-w-[650px] bg-black rounded-full px-6 py-4 flex items-center justify-between",
          brand: "flex items-center gap-3 flex-shrink-0",
          content: "flex items-center gap-6",
          item: "text-white text-lg font-regular hover:text-gray-300 transition-colors duration-300",
          toggle: "text-white",
          menu: "bg-black/95 backdrop-blur-md mt-4 rounded-2xl",
          menuItem: "text-white"
        }}
        style={{
          background: 'transparent',
          boxShadow: 'none'
        }}
      >
      {/* Left Section - Brand */}
      <NavbarBrand className="flex-shrink-0">
        <img
          src={DoodleImageNav}
          alt="SkyHere Logo"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={() => scrollToSection('hero')}
          className="text-white text-xl sm:text-2xl font-bold hover:text-gray-300 transition-colors duration-300 focus:outline-none ml-3"
        >
          SkyHere
        </button>
      </NavbarBrand>

      {/* Right Section - Navigation Items + Contact Button */}
      <NavbarContent className="hidden md:flex gap-6 flex-shrink-0" justify="end">
        {menuItems.map((item) => (
          <NavbarItem key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className="text-white text-lg font-regular hover:text-gray-300 transition-colors duration-300 focus:outline-none whitespace-nowrap"
            >
              {item.name}
            </button>
          </NavbarItem>
        ))}
        <NavbarItem>
          <MagneticButton
            onClick={handleContactClick}
            variant="stroke"
            className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap"
          >
            Get in Touch
          </MagneticButton>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Toggle */}
      <NavbarMenuToggle className="md:hidden text-white" />

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/95 backdrop-blur-md pt-6 pb-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.id}-${index}`}>
            <button
              onClick={() => scrollToSection(item.id)}
              className="w-full text-left text-white text-lg font-regular hover:text-gray-300 transition-colors duration-300 py-3"
            >
              {item.name}
            </button>
          </NavbarMenuItem>
        ))}
        {/* Mobile Contact Button */}
        <NavbarMenuItem className="pt-4">
          <MagneticButton
            onClick={handleContactClick}
            variant="stroke"
            className="w-full text-base px-6 py-3"
          >
            Get in Touch
          </MagneticButton>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
    </div>
  )
}

export default Navigation