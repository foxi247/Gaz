import { useState, useEffect, useCallback } from 'react';
import { accounts as mockAccounts } from '../data/mockData';
import type { Account, AccountType, CurrencyCode } from '../types/finance';
import { isSupabaseConfigured } from '../lib/supabase';
import { getAccounts, createAccount } from '../services/accounts';

export function useAccounts(userId: string) {
  const [accounts, setAccounts] = useState<Account[]>(isSupabaseConfigured ? [] : mockAccounts);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAccounts(userId);
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const addAccount = useCallback(async (payload: {
    name: string;
    type: AccountType;
    currency?: CurrencyCode;
  }) => {
    if (!isSupabaseConfigured) return;
    const account = await createAccount({ userId, ...payload });
    setAccounts((prev) => [...prev, account]);
  }, [userId]);

  const patchBalance = useCallback((accountId: string, newBalance: number) => {
    setAccounts((prev) =>
      prev.map((acc) => acc.id === accountId ? { ...acc, balance: newBalance } : acc)
    );
  }, []);

  return { accounts, setAccounts, loading, error, reload: load, addAccount, patchBalance };
}
