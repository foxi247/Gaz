import { supabase } from '../lib/supabase';
import type { Account, AccountType, CurrencyCode } from '../types/finance';
import type { Database } from '../types/database';

type AccountRow = Database['public']['Tables']['accounts']['Row'];

const COLOR_MAP: Record<AccountType, Account['color']> = {
  checking: 'dark',
  savings: 'green',
  card: 'silver',
  investment: 'light',
  crypto: 'dark',
};

function toUiAccount(row: AccountRow): Account {
  const type = row.type as AccountType;
  const last4 = row.id.replace(/-/g, '').slice(-4).toUpperCase();
  const number =
    type === 'crypto' ? 'BTC · ETF' :
    type === 'investment' ? 'Portfolio' :
    `**** ${last4}`;

  return {
    id: row.id,
    name: row.name,
    type,
    balance: row.balance,
    currency: row.currency as CurrencyCode,
    number,
    trend: 0,
    color: COLOR_MAP[type] ?? 'light',
  };
}

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

export async function getAccounts(userId: string): Promise<Account[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toUiAccount);
}

export async function getAccountById(accountId: string): Promise<Account | null> {
  const client = requireClient();
  const { data, error } = await client
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toUiAccount(data) : null;
}

export async function createAccount(payload: {
  userId: string;
  name: string;
  type: AccountType;
  currency?: CurrencyCode;
}): Promise<Account> {
  const client = requireClient();
  const { data, error } = await client
    .from('accounts')
    .insert({
      user_id: payload.userId,
      name: payload.name,
      type: payload.type,
      currency: payload.currency ?? 'USD',
      balance: 0,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return toUiAccount(data);
}

export async function updateAccountBalance(accountId: string, balance: number): Promise<void> {
  const client = requireClient();
  const { error } = await client
    .from('accounts')
    .update({ balance })
    .eq('id', accountId);
  if (error) throw new Error(error.message);
}
