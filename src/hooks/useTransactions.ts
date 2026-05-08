import { useState, useEffect, useCallback } from 'react';
import { transactions as mockTransactions } from '../data/mockData';
import type { Transaction } from '../types/finance';
import { isSupabaseConfigured } from '../lib/supabase';
import { getTransactions } from '../services/transactions';

export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    isSupabaseConfigured ? [] : mockTransactions
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
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
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const prependTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  return { transactions, loading, error, reload: load, prependTransaction };
}
