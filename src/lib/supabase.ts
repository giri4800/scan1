import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables are automatically injected by Stackblitz
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your configuration.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);