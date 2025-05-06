'use client';
import React, { useState } from 'react';
import Footer from "@/components/Footer";
import StickyNavbar from "@/components/StickyNavbar";
import { clientDB } from "@/services/supabaseClient";

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
  const [isLogin, setIsLogin] = useState(true); //Toggle between login/signup
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const { error } = await clientDB.auth.signInWithPassword({ email, password });
        if (error) throw error;

        window.location.href = '/profile';
        setMessage({ 
          text: 'Logged in successfully!', 
          type: 'success' 
        });
      }
      else {
        // Signup flow
        const { data, error } = await clientDB.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            skipEmailConfirmation: true
          }
        });

        if (error) throw error;

        const { error: signInError } = await clientDB.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (signInError) throw signInError;
        
        window.location.href = '/profile';
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StickyNavbar />

      <main className="min-h-screen flex items-center justify-center bg-[#F5E3C6]">
        <form
          onSubmit={handleSubmit}
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
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h1>

          {message.text && (
            <div className={`mb-4 p-2 rounded text-center text-sm ${message.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
              }`}>
              {message.text}
            </div>
          )}

          <label className="block mb-2">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border-1 border-[#F5E3C6] px-3 py-2 text-[#8B4C24] focus:border-[#639751] focus:outline-none focus:ring-0 transition"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border-1 border-[#F5E3C6] px-3 py-2 text-[#8B4C24] focus:border-[#639751] focus:outline-none focus:ring-0 transition"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#639751] text-white font-semibold py-2 rounded hover:bg-[#6bb053] transition disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#8B4C24] hover:text-[#639751] underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}
