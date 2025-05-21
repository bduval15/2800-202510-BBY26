import Link from 'next/link'
import Image from 'next/image'

/**
 * NotFound.jsx
 * Loaf Life - Not Found Page
 * 
 * This page displays a 404 error message when a requested page is not found.
 * It provides a friendly message and a link to return to the main feed page.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * 
 * @author: Nathan O
 * @author: https://gemini.google.com/app
 */

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E3C6] text-[#6A401F] p-4">
      <div className="w-64 h-64 relative mb-8">
        <Image
          src="/images/404loaf.png"
          alt="Confused Loaf of Bread"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <h1 className="font-bold mb-4 flex flex-col items-center text-center">
        <span className="text-5xl">Oops!</span>
        <span className="whitespace-nowrap text-4xl ">Page Not Found</span>
      </h1>
      <p className="text-lg mb-8 text-center max-w-md">
        It seems this page has crumbled away or was never baked in the first place.
        Let's get you back to familiar dough.
      </p>
      <Link
        href="/main-feed-page"
        className="py-3 px-8 rounded-full text-lg font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap bg-[#8B4C24] text-white hover:bg-[#7a421f] shadow-md hover:shadow-lg"
      >
        Return Home
      </Link>
    </div>
  )
} 
