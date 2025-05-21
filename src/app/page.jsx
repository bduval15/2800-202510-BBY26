/**
 * Home.jsx
 * 
 * Loaf Life - Landing Page
 * 
 * Primary entry point featuring:
 * - Brand presentation
 * - Value proposition messaging
 * - Conversion-focused CTA
 * - Feature explanation section
 * 
 * Enhanced with ChatGPT assistance for:
 * - Tailwind CSS implementation
 * - Semantic HTML structure
 * - Responsive layout configuration
 * 
 * @author Natalia Arseniuk
 * @author https://chatgpt.com/*
 */

import Link from 'next/link';
import Footer from "@/components/Footer";

/**
 * Landing Page Component
 * 
 * @function Home
 * @description Renders the application's entry point with:
 * - Brand identity display
 * - Core value proposition
 * - Conversion triggers
 * - Feature explanation matrix
 * 
 * @returns {JSX.Element} Structured landing page layout
 */
export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 pt-25 flex flex-col items-center font-sans">
        
        {/* Brand Identity Section */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="images/logo.png" 
            alt="Loaf Life Logo - Bread loaf mascot" 
            className="w-17 h-17" 
          />
          <h1 className="text-3xl font-bold">LOAF LIFE</h1>
        </div>

        {/* Value Proposition Copy */}
        <h2 className="text-2xl font-semibold text-center max-w-md">
          Survive and thrive on a student budget
        </h2>
        <p className="text-[#C27A49] mt-4 text-center max-w-md">
          Discover free food spots, great deals, and money-saving hacks.
        </p>

        {/* Primary Conversion CTA */}
        <Link href="/login-page">
          <button className="mt-10 bg-[#639751] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#6bb053] transition">
            Get Started
          </button>
        </Link>

        {/* Feature Explanation Grid */}
        <section className="mt-14 grid grid-cols-3 gap-10 text-center text-sm">
          <div>
            <Link href="/login-page">
              <img 
                src="images/browse.png" 
                alt="Browse feature - Magnifying glass icon" 
                className="w-14 mx-auto mb-2" 
              />
              <p>Browse</p>
            </Link>
          </div>
          <div>
            <Link href="/login-page">
              <img 
                src="images/save.png" 
                alt="Save feature - Piggy bank icon" 
                className="w-14 mx-auto mb-2" 
              />
              <p>Save</p>
            </Link>
          </div>
          <div>
            <Link href="/login-page">
              <img 
                src="images/live.png" 
                alt="Live Well feature - Heart icon" 
                className="w-14 mx-auto mb-2" 
              />
              <p>Live Well</p>
            </Link>
          </div>
        </section>
      </main>

      {/* Global Footer Component */}
      <div>
        <Footer />
      </div>
    </>
  );
}