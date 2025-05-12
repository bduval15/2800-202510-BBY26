/**
 * supabaseClient.js
 * Loaf Life – Supabase client for App Router of client data
 *
 * Uses @supabase/auth-helpers-nextjs to enable cookie-based auth persistence.
 *
 * @author Conner Ponton
 * 
 * @author ChatGPT
 * Utilized for guidance on persistent sessions and error checking 
 */

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

//Client-side Supabase instance for use in React components.
export const clientDB = createClientComponentClient({
  cookieOptions: {
    maxAge: 3600, // 1 hour
    secure: true,
    sameSite: 'lax',
    path: '/',
  },
});