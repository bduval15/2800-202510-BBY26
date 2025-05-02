const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Protected constants
const supaURL = process.env.SUPABASE_URL; 
const publicKey = process.env.PUBLIC_ANON_KEY;
const serviceKey = process.env.PRIVATE_SERVICE_KEY;
const tokDecoder = process.env.JWT_TOKEN_DECODER;

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionUrl: true
  },
  gobal: {
    headers: {'bby26-supabase': 'LoafLife'},
  },
}
const supabase = createClient(supaURL, publicKey, options);