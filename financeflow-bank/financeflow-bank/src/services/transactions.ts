import { supabase } from '../lib/supabase';
import type { Transaction, TransactionType, TransactionStatus } from '../types/finance';
import type { Database } from '../types/database';

type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

function toUiTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    type: row.type as TransactionType,
    category: row.category,
    amount: row.amount,
    title: row.title,
    description: row.description ?? '',
    status: row.status as TransactionStatus,
    createdAt: row.created_at,
  };
}

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toUiTransaction);
}

export async function getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toUiTransaction);
}

export async function getRecentTransactions(userId: string, limit = 5): Promise<Transaction[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toUiTransaction);
}

export async function createTransaction(payload: Omit<TransactionInsert, 'id'>): Promise<Transaction> {
  const client = requireClient();
  const { data, error } = await client
    .from('transactions')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return toUiTransaction(data);
}
