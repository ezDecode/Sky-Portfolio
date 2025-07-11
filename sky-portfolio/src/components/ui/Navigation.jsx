import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from '@heroui/react'
import MagneticButton from './MagneticButton'
import DoodleImageNav from '../../assets/images/DoodleImageNav.png'

const Navigation = () => {
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
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" }
  ]

  return (
    <Navbar
      shouldHideOnScroll
      position="sticky"
      maxWidth="full"
      height="auto"
      className="navbar-transparent"
      classNames={{
        base: "bg-transparent p-0 flex justify-center !bg-transparent fixed top-4 sm:top-6 left-0 right-0 z-50",
        wrapper: "max-w-[650px] bg-black rounded-full px-6 py-4",
        brand: "flex items-center gap-3 flex-grow-0",
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
      {/* Brand Section */}
      <NavbarBrand>
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

      {/* Desktop Navigation Items */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className="text-white text-lg font-regular hover:text-gray-300 transition-colors duration-300 focus:outline-none"
            >
              {item.name}
            </button>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Contact Button */}
      <NavbarContent justify="end">
        <NavbarItem>
          <MagneticButton
            onClick={handleContactClick}
            variant="stroke"
            className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            Get in Touch
          </MagneticButton>
        </NavbarItem>
        <NavbarMenuToggle className="md:hidden text-white" />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/95 backdrop-blur-md pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.id}-${index}`}>
            <button
              onClick={() => scrollToSection(item.id)}
              className="w-full text-left text-white text-lg font-regular hover:text-gray-300 transition-colors duration-300 py-2"
            >
              {item.name}
            </button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default Navigation