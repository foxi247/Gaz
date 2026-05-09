import { useState, useEffect, useCallback } from 'react';
import { accounts as mockAccounts } from '../data/mockData';
import type { Account, AccountType, CurrencyCode } from '../types/finance';
import { isSupabaseConfigured } from '../lib/supabase';
import { getAccounts, createAccount } from '../services/accounts';

export function useAccounts(userId: string, isAuthenticated: boolean) {
  const liveMode = isSupabaseConfigured && isAuthenticated;
  const [accounts, setAccounts] = useState<Account[]>(liveMode ? [] : mockAccounts);
  const [loading, setLoading] = useState(liveMode);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!liveMode) return;
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
  }, [userId, liveMode]);

  useEffect(() => { load(); }, [load]);

  const addAccount = useCallback(async (payload: {
    name: string;
    type: AccountType;
    currency?: CurrencyCode;
  }) => {
    if (!liveMode) return;
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
