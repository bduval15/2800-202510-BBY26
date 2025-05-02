/**
 * StickyNavbar.jsx
 * Loaf Life – fixed top navigation bar with Browse, Save, Live Well links.
 *  
 * I took this template for the sticky navBar from flowbite.com
 * 
 * @author flowbite 
 * @see https://flowbite.com/docs/components/navbar/
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author https://chatgpt.com/
 */

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-[#F5E3C6] fixed w-full z-20 top-0 left-0 border-b border-[#D1905A]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-1">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/images/logo.png"
            alt="Loaf Life Logo"
            className="h-12 w-12"
          />
        </Link>
        <span className="text-2xl font-semibold text-[#8B4C24]">
            LOAF LIFE
          </span>

        {/* Nav Links */}
        <div className="flex space-x-8">
          <Link
            href="/profile"
            className="flex flex-col items-center text-sm text-[#8B4C24] hover:text-[#639751]"
          >
            <img
              src="/images/profile.png"
              alt="Live Well"
              className="h-8 w-12 mb-1"
            />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
