import { supabase } from '../lib/supabase';
import type { UserProfile, CurrencyCode } from '../types/finance';
import type { Database } from '../types/database';

type UserRow = Database['public']['Tables']['users']['Row'];

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

function toUiProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url ?? '',
    currency: 'USD' as CurrencyCode,
  };
}

export async function getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
  const client = requireClient();
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toUiProfile(data) : null;
}

export async function upsertUserProfile(payload: {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}): Promise<UserProfile> {
  const client = requireClient();
  const { data, error } = await client
    .from('users')
    .upsert({
      id: payload.id,
      full_name: payload.fullName,
      email: payload.email,
      avatar_url: payload.avatarUrl ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return toUiProfile(data);
}
