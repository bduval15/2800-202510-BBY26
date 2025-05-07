/**
 * Footer.jsx
 * Loaf Life – fixed bottom footer with Logo, App Name, and AboutUs Link.
 *  
 * Brady took this template for the sticky footer from flowbite.com
 * 
 * @author flowbite 
 * @see https://flowbite.com/docs/components/footer/
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval 
 * @author https://chatgpt.com/
 */
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#F5E3C6] border-t border-[#D1905A]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="Loaf Life Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold text-[#8B4C24]">LOAF LIFE</span>
        </Link>
        <Link
          href="/about-page"
          className="text-sm font-medium text-[#8B4C24] hover:text-[#639751]"
        >
          About Us
        </Link>
      </div>
    </footer>
  )
}
