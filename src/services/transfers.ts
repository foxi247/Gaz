import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import { getAccountById, updateAccountBalance } from './accounts';
import { createTransaction } from './transactions';

export type TransferRow = Database['public']['Tables']['transfers']['Row'];

export interface ExecuteTransferParams {
  senderUserId: string;
  receiverUserId?: string | null;
  fromAccountId: string;
  toAccountId?: string | null;
  amount: number;
  comment?: string | null;
  receiverName?: string;
}

export interface TransferResult {
  transferId: string;
  status: 'completed' | 'pending' | 'failed';
}

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

/**
 * Executes a transfer between accounts.
 *
 * NOTE: These steps are sequential and NOT atomic. If the process crashes mid-way
 * the database will be in a partial state. Move this to a Postgres function
 * (supabase.rpc('execute_transfer', ...)) to get true atomicity.
 */
export async function executeTransfer(params: ExecuteTransferParams): Promise<TransferResult> {
  const client = requireClient();

  const fromAccount = await getAccountById(params.fromAccountId);
  if (!fromAccount) throw new Error('Source account not found');
  if (fromAccount.balance < params.amount) throw new Error('Insufficient balance');

  const { data: transfer, error: transferError } = await client
    .from('transfers')
    .insert({
      sender_user_id: params.senderUserId,
      receiver_user_id: params.receiverUserId ?? null,
      from_account_id: params.fromAccountId,
      to_account_id: params.toAccountId ?? null,
      amount: params.amount,
      comment: params.comment ?? null,
      status: 'completed' as const,
    })
    .select()
    .single();

  if (transferError) throw new Error(transferError.message);

  await updateAccountBalance(params.fromAccountId, fromAccount.balance - params.amount);

  if (params.toAccountId) {
    const toAccount = await getAccountById(params.toAccountId);
    if (toAccount) {
      await updateAccountBalance(params.toAccountId, toAccount.balance + params.amount);
    }
  }

  const transferTitle = params.receiverName
    ? `Transfer to ${params.receiverName}`
    : 'Outgoing transfer';

  await createTransaction({
    user_id: params.senderUserId,
    account_id: params.fromAccountId,
    type: 'transfer',
    category: 'Transfer',
    amount: params.amount,
    title: transferTitle,
    description: params.comment ?? null,
    status: 'completed',
  });

  if (params.toAccountId && params.receiverUserId) {
    await createTransaction({
      user_id: params.receiverUserId,
      account_id: params.toAccountId,
      type: 'transfer',
      category: 'Transfer',
      amount: params.amount,
      title: 'Incoming transfer',
      description: params.comment ?? null,
      status: 'completed',
    });
  }

  return { transferId: transfer.id, status: transfer.status };
}

export async function getTransfers(userId: string): Promise<TransferRow[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('transfers')
    .select('*')
    .or(`sender_user_id.eq.${userId},receiver_user_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
