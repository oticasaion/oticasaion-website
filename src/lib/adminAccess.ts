import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// app_metadata is assigned only by trusted server-side administration.
export function isAdmin(user: User | null | undefined): boolean {
  return !!user && !user.is_anonymous && user.app_metadata?.role === 'admin';
}

export async function requireAdmin(): Promise<User> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !isAdmin(data.user)) throw new Error('Acesso restrito. Entre com uma conta administrativa autorizada.');
  return data.user!;
}
