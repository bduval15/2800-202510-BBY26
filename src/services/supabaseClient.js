/**
 * supabaseClient.js
 * Loaf Life - supabase client files
 * 
 * Connects and accesses supabase DB
 * 
 * @author: Conner Ponton
 * 
 * Written with assistance from Deepseek
 * @author https://chat.deepseek.com/
 */
import { createClient } from '@supabase/supabase-js';

// Client-side variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase client environmental variables
    - NEXT_PUBLIC_SUPABASE_URL ${!supabaseUrl}
    - NEXT_PUBLIC_SUPABASE_ANON_KEY ${supabaseAnonKey}
  `);
}

export const clientDB = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'bby26-supabase-client': 'LoafLife' },
  },
});

//For server-side usage only
export const getServerDB = () => {
  if (typeof window !== 'undefined') {
    throw new Error('ServerDB should only be used on the server');
  }
  
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_KEY is required for serverDB');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
};