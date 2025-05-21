/**
 * supabaseServer.js
 * 
 * Loaf Life - Server-Side Supabase Clients
 * 
 * Provides authenticated Supabase instances for:
 * - Server Components/Layouts
 * - Server Actions (form submissions)
 * Implements secure cookie-based authentication persistence through Next.js helpers.
 * 
 * @author Conner Ponton
 * @author ChatGPT - Assisted with server-client configuration guidance
 */

import { cookies } from 'next/headers';
import {
  createServerComponentClient,
  createServerActionClient,
} from '@supabase/auth-helpers-nextjs';

/**
 * Server Component Database Client
 * @function getServerDB
 * @returns {Object} Supabase client instance
 * @description Creates Supabase client for server components/layouts:
 * - Automatic cookie handling
 * - Full access to current user session
 * - Safe for SSR/SSG operations
 * 
 * @example
 * const supabase = getServerDB();
 * const { data } = await supabase.from('table').select();
 */
export const getServerDB = () =>
  createServerComponentClient({ cookies });

/**
 * Server Action Database Client
 * @function getServerActionDB
 * @returns {Object} Supabase client instance
 * @description Creates Supabase client for server-side actions:
 * - Form submissions handling
 * - Cookie-based auth in Actions context
 * - No React component lifecycle access
 * 
 * @example
 * async function handleSubmit(formData) {
 *   const supabase = getServerActionDB();
 *   // Perform authenticated operation
 * }
 */
export const getServerActionDB = () =>
  createServerActionClient({ cookies });