import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.warn("Aviso: VITE_SUPABASE_URL não encontrada. Usando placeholder.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

