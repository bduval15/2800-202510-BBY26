/**
 * supabaseServer.js
 * Loaf Life – Supabase server for direct database access when handling back-end operations
 *
 * Uses @supabase/auth-helpers-nextjs to enable cookie-based auth persistence.
 *
 * @author Conner Ponton
 * 
 * @author ChatGPT
 * Utilized for guidance on persistent sessions and error checking 
 */
import { cookies } from 'next/headers';
import {
  createServerComponentClient,
  createServerActionClient,
} from '@supabase/auth-helpers-nextjs';


//Use inside server components or layouts
export const getServerDB = () =>
  createServerComponentClient({ cookies });



//Use inside server actions (e.g. form POSTs)

export const getServerActionDB = () =>
  createServerActionClient({ cookies });
