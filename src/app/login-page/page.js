import React from 'react'
import Footer from "@/components/Footer"
import StickyNavbar from "@/components/StickyNavbar"
import { clientDB } from "@/services/supabaseClient"

/**
 * page.js
 * Loaf Life – login page where users can enter credentials.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * Further assistance in sign up logic
 * @author https://chatgpt.com/*
 */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
    return (
        <>
    <StickyNavbar/>
        
      <main className="min-h-screen flex items-center justify-center bg-[#F5E3C6]">
        <form
          className="
            bg-white
            rounded
            p-7
            border-3
            border-[#8B4C24]
            shadow-md
            w-full
            max-w-sm
            text-[#8B4C24]
          "
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Log In / Sign Up</h1>
          <label className="block mb-2">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded border-1 border-[#F5E3C6] px-3 py-2 text-[#8B4C24] focus:border-[#639751] focus:outline-none focus:ring-0 transition"
              placeholder="you@example.com"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="mt-1 block w-full rounded border-1 border-[#F5E3C6]  px-3 py-2 text-[#8B4C24] focus:border-[#639751] focus:outline-none focus:ring-0 transition"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-[#639751] text-white font-semibold py-2 rounded hover:bg-[#6bb053] transition"
          >
            Sign In
          </button>
        </form>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
      </>
      
    );
  }
  