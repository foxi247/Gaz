import { useState, useEffect, useCallback } from 'react';
import { transactions as mockTransactions } from '../data/mockData';
import type { Transaction } from '../types/finance';
import { isSupabaseConfigured } from '../lib/supabase';
import { getTransactions } from '../services/transactions';

export function useTransactions(userId: string, isAuthenticated: boolean) {
  const liveMode = isSupabaseConfigured && isAuthenticated;
  const [transactions, setTransactions] = useState<Transaction[]>(
    liveMode ? [] : mockTransactions
  );
  const [loading, setLoading] = useState(liveMode);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!liveMode) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions(userId);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [userId, liveMode]);

  useEffect(() => { load(); }, [load]);

  const prependTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  return { transactions, loading, error, reload: load, prependTransaction };
}
