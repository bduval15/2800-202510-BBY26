/**
 * ==============================================
 * AI-GENERATED CODE ACKNOWLEDGMENT
 * ==============================================
 * This file contains code generated with the assistance of AI tools (Deep Seek)
 * 
 * AI was used for:
 * - Reviewing for correctness
 * - Adapting to project-specific requirements (explaining public vs service keys)
 * ==============================================
 */
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Protected constants
const supaURL = process.env.SUPABASE_URL; 
const publicKey = process.env.PUBLIC_ANON_KEY;
const serviceKey = process.env.PRIVATE_SERVICE_KEY;
const tokDecoder = process.env.JWT_TOKEN_DECODER;

console.log({
  supaURL: process.env.SUPABASE_URL,
  publicKey: process.env.PUBLIC_ANON_KEY,
  serviceKey: process.env.PRIVATE_SERVICE_KEY,
  tokDecoder: process.env.JWT_TOKEN_DECODER
});

if (!supaURL || !publicKey || !serviceKey || !tokDecoder) 
  {
  throw new Error("Missing Supabase environment variables");
}

//Used for public database access which is constrained to RLS restrictions
//Provides browser like interactions
const clientDB = createClient(supaURL, publicKey, 
  {
  db: 
  { 
    schema: 'public' 
  },
  auth: 
  {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,   
  },
  global: {
    headers: { 'bby26-supabase-client': 'LoafLife' },
  },
});

//CAUTION Only use for back-end server-side interactions
//Used for serverside database interactions unrestricted from RLS constraints
const serverDB = createClient(supaURL, serviceKey, 
  {
  db: 
  { 
    schema: 'public' 
  },
  auth: 
  {
    autoRefreshToken: true,
    persistSession: false,      
    detectSessionInUrl: true,   
  },
  global: 
  {
    headers: 
    { 
      'bby26-supabase-server': 'LoafLife' 
    },
  },
});

module.exports = { clientDB, serverDB };

//import supabase variables with these
//import { serverDB } from "@/services/supabaseClient";
//import { clientDB } from "@/services/supabaseClient";