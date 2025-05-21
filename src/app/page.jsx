
/**
 * Loaf Life – landing page with logo, main heading, CTA button, and how-it-works section.
 *
 * Portions of styling and layout were assisted by ChatGPT for educational purposes (e.g., Tailwind class structuring, semantic HTML structure).
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Natalia Arseniuk
 * @author https://chatgpt.com/*
 */
import Link from 'next/link';
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 pt-25 flex flex-col items-center font-sans">
        {/* Header / Logo */}
        <div className="flex items-center gap-3 mb-6">
          <img src="images/logo.png" alt="Loaf Life Logo" className="w-17 h-17" />
          <h1 className="text-3xl font-bold">LOAF LIFE</h1>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl font-semibold text-center max-w-md">
          Survive and thrive on a student budget
        </h2>
        <p className="text-[#C27A49] mt-4 text-center max-w-md">
          Discover free food spots, great deals, and money-saving hacks.
        </p>

        {/* CTA – redirect to loginPage.js */}
        <Link href="/login-page">
          <button className="mt-10 bg-[#639751] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#6bb053] transition">
            Get Started
          </button>
        </Link>

        {/* How it Works */}
        <section className="mt-14 grid grid-cols-3 gap-10 text-center text-sm">
          <div>
            <Link href="/login-page">
              <img src="images/browse.png" alt="Browse" className="w-14 mx-auto mb-2" />
              <p>Browse</p>
            </Link>
          </div>
          <div>
            <Link href="/login-page">
              <img src="images/save.png" alt="Save" className="w-14 mx-auto mb-2" />
              <p>Save</p>
            </Link>
          </div>
          <div>
            <Link href="/login-page">
              <img src="images/live.png" alt="Live Well" className="w-14 mx-auto mb-2" />
              <p>Live Well</p>
            </Link>
          </div>
        </section>
      </main>
      <div>
        <Footer />
      </div>
    </>
  );
}