require('dotenv').config();

// Protected constants
const supaURL = process.env.SUPABASE_URL; 
const publicKey = process.env.PUBLIC_ANON_KEY;
const serviceKey = process.env.PRIVATE_SERVICE_KEY;
const tokDecoder = process.env.JWT_TOKEN_DECODER;

