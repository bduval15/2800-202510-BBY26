/**
 * StickyNavbar.jsx
 * Loaf Life – fixed top navigation bar with logo and hamburger menu.
 *
 * Brady took this template for the sticky navBar from flowbite.com
 * @see https://flowbite.com/docs/components/navbar/
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 *
 * @author flowbite
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function Navbar
 * @description Renders a fixed top navigation bar with the app logo, title, and hamburger menu.
 */

import Link from 'next/link'
import HamburgerDropdown from './HamburgerMenu'

export default function Navbar() {
  return (
    // Sticky top navigation container
    <nav className="bg-[#F5E3C6] fixed w-full z-100 top-0 left-0 border-b-3 border-[#D1905A]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-1">
        {/* Logo linking to main feed */}
        <Link href="/main-feed-page" className="flex items-center space-x-3">
          <img
            src="/images/logo.png"
            alt="Loaf Life Logo"
            className="h-12 w-12"
          />
        </Link>
        {/* Application title */}
        <span className="text-2xl font-semibold text-[#8B4C24]">
          LOAF LIFE
        </span>
        {/* Right side hamburger dropdown */}
        <div className="flex space-x-8">
          <HamburgerDropdown />
        </div>
      </div>
    </nav>
  )
}
