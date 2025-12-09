import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined';

if (!isSupabaseConfigured) {
  console.warn("Missing Supabase environment variables! Gallery features will be in DEMO mode (local only).");
}

// Safely create client or a fallback to prevent white screen of death on load
export const supabase = isSupabaseConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder');