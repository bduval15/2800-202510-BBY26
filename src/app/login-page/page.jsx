'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";
import { clientDB } from '@/supabaseClient';
import isEmail from 'validator/lib/isEmail';

/**
 * login-page.jsx
 * Loaf Life – login page where users can enter credentials.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * Further assistance in sign up logic
 * 
 * @author Conner Ponton
 * 
 * @author https://chatgpt.com/*
 */

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/;
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email) || !isEmail(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error'});
      return;
    } 

    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const { error } = await clientDB.auth.signInWithPassword({ email, password });
        if (error) throw error;

        await clientDB.auth.getSession();

        window.location.href = '/main-feed-page';
        setMessage({
          text: 'Logged in successfully!',
          type: 'success'
        });
      }
      else {
        // Signup flow
        const { error: signUpError } = await clientDB.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            skipEmailConfirmation: true,
            data: {
              username: username,
            },
          },
        });
        if (signUpError) throw signUpError;

        const { error: signInError } = await clientDB.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        const {
          data: { user },
          error: userError,
        } = await clientDB.auth.getUser();
        if (userError) throw userError;

        await clientDB
          .from('user_profiles')
          .upsert([
            { id: user.id, name: username, school: '', bio: '', avatar_url: '', interests: [] }
          ])
          .select();

        window.location.href = '/onboarding';
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <main
        className="
         min-h-screen flex items-center justify-center
         bg-[#F5E3C6]                                   
         bg-[url('/images/loafs/loaf-bg.png')]          
         bg-cover                            
         bg-center                                    
      "
      >
        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded p-7 border-3 border-[#8B4C24] shadow-md w-full max-w-sm text-[#8B4C24]">
          <button
            type="button"
            onClick={handleBack}
            className="
            absolute top-2 left-2       
            flex items-center space-x-2
            px-2 py-1
            border-2 border-[#639751]
            bg-white
            text-[#8B4C24] text-sm font-medium
            rounded-full
            shadow
            hover:bg-[#639751] hover:text-white
            transition-colors
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
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

          {!isLogin && (
            <label className="block mb-2">
              <span className="text-sm font-medium">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded border-1 border-[#F5E3C6] px-3 py-2 text-[#8B4C24] focus:border-[#639751] focus:outline-none focus:ring-0 transition"
                placeholder="John Loaf"
                required
              />
            </label>
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
              placeholder="Password123!"
              required
              minLength="6"
            />
            <a href="not-found" className="text-xs text-gray-500 hover:underline mt-2">Forgot password?</a>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#639751] text-white font-semibold py-2 rounded hover:bg-[#6bb053] transition disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <span>{isLogin ? 'Log In' : 'Create Account'}</span>
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
