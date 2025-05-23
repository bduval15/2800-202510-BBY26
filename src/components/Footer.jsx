/**
 * Footer.jsx
 * Footer with Logo link, About Us page link, social icons, slogan, and copyright notice.
 *
 * Generated with help of ChatGPT o4-mini-high.
 *
 * @author Natalia Arseniuk
 * @author https://chatgpt.com/
 *
 * @function Footer
 * @description Renders the footer section containing social media links, a company slogan, and copyright information.
 */

// Social media icons from react-icons library
import { FaInstagram, FaTwitter, FaFacebookF, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    // Footer container with background and top border styling
    <footer className="bg-[#F5E3C6] border-t border-[#D1905A] text-[#8B4C24]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
      </div>
      {/* Bottom Row: Contains social icons, slogan, and copyright */}
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 pb-4 gap-3">
        {/* Social Icons Group */}
        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-[#639751]" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" className="hover:text-[#639751]" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" className="hover:text-[#639751]" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" className="hover:text-[#639751]" aria-label="TikTok"><FaTiktok /></a>
        </div>

        {/* Slogan */}
        <p className="text-sm italic text-center">“Always enjoy each slice of life.”</p>

        {/* Copyright notice aligned responsively */}
        <p className="text-xs text-[#5C3D2E] text-center sm:text-right">
          &copy; 2025 Loaf Life. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
