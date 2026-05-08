import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

export async function getCategories(userId: string): Promise<CategoryRow[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCategory(payload: Omit<CategoryInsert, 'id'>): Promise<CategoryRow> {
  const client = requireClient();
  const { data, error } = await client
    .from('categories')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
