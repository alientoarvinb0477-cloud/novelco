import { createClient } from '@supabase/supabase-js';

// Use the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Basic check to prevent the "Invalid supabaseUrl" crash
if (!supabaseUrl.startsWith('http')) {
  console.error("Supabase URL is missing or invalid. Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);