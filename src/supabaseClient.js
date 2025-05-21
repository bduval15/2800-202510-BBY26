/**
 * supabaseClient.js
 * 
 * Loaf Life - Supabase Client Configuration
 * 
 * Provides authenticated Supabase client instance for Next.js App Router with:
 * - Cookie-based authentication persistence
 * - Secure session management
 * - Client-side component access
 * 
 * @author Conner Ponton
 * @author ChatGPT - Assisted with auth configuration guidance
 */

'use client'; // Next.js client component directive

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Supabase Client Instance
 * @constant {Object} clientDB
 * @description Configures and exports Supabase client with secure cookie settings:
 * - Automatic JWT refresh handling
 * - Client-side auth state management
 * - Secure cookie policies for production
 * 
 * @example
 * import { clientDB } from '@/supabaseClient';
 * const { data } = await clientDB.from('table').select();
 */
export const clientDB = createClientComponentClient({
  cookieOptions: {
    /**
     * Session Cookie Configuration
     * - maxAge: 1 hour expiration (matches Supabase JWT expiry)
     * - secure: Enforce HTTPS-only cookies
     * - sameSite: Lax policy for CSRF protection
     * - path: Root path accessibility
     */
    maxAge: 3600, // 3600 seconds = 1 hour (matches default Supabase JWT expiry)
    secure: true,  // Require HTTPS in production
    sameSite: 'lax', // Balance security and cross-origin needs
    path: '/',     // Accessible across entire domain
  },
});