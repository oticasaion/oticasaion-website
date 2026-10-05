import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vdptrgqxrwugrtienktg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ogp2Von8GK8wckWe-1PlZg_IqdjZtV0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = () => supabase;
