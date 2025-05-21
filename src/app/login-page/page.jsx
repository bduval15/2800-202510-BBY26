/**
 * login-page.jsx
 * 
 * Loaf Life - Authentication Gateway
 * 
 * Handles user authentication flows including:
 * - Login with email/password
 * - New account registration
 * - Password visibility toggle
 * - Session redirection handling
 * 
 * Modified with assistance from ChatGPT o4-mini-high for:
 * - Auth logic implementation
 * - Form validation patterns
 * 
 * @author Conner Ponton
 * @author https://chatgpt.com/ (Auth flow assistance)
 */

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";
import { clientDB } from '@/supabaseClient';
import isEmail from 'validator/lib/isEmail';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Authentication Form Component
 * 
 * @function LoginPage
 * @description Primary authentication component handling:
 * - Login/signup state toggling
 * - Credential validation
 * - Supabase auth integration
 * - User redirection flows
 * 
 * @returns {JSX.Element} Interactive authentication form UI
 */
export default function LoginPage() {
  // Form state management
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  // Email validation pattern
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  /**
   * Form Submission Handler
   * 
   * @async
   * @function handleSubmit
   * @description Processes authentication form submission:
   * - Validates email format
   * - Handles login/signup Supabase operations
   * - Manages user redirection & profile creation
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation check
    if (!emailRegex.test(email) || !isEmail(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Existing user login flow
        const { error } = await clientDB.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Force session refresh before redirect
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

        // Auto-login after successful signup
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
            { id: user.id, 
              name: username, 
              school: '', 
              bio: '', 
              avatar_url: '', 
              interests: [] }
          ])
          .select();

        // Redirect to onboarding process
        window.location.href = '/onboarding';
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigation Handler
   * 
   * @function handleBack
   * @description Manages backward navigation with fallback to home:
   * - Uses browser history when available
   * - Defaults to root route when no history
   */
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

          {/* System message display */}
          {message.text && (
            <div className={`mb-4 p-2 rounded text-center text-sm ${message.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
              }`}>
              {message.text}
            </div>
          )}

          {/* Conditional username field */}
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

          {/* Email input field */}
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

          {/* Password input with visibility toggle */}
          <label className="block mb-4 relative">
            <span className="text-sm font-medium">Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border-1 border-[#F5E3C6] px-3 py-2 pr-10 text-[#8B4C24] focus:border-[#639751] focus:outline-none focus:ring-0 transition"
              placeholder="Password123!"
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 text-[#8B4C24] hover:text-[#639751] focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <a href="not-found" className="text-xs text-gray-500 hover:underline mt-2 inline-block">Forgot password?</a>
          </label>

          {/* Primary action button */}
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

          {/* Auth mode toggle */}
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