import { useState, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { executeTransfer } from '../services/transfers';
import type { ExecuteTransferParams, TransferResult } from '../services/transfers';

export function useTransfer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transfer = useCallback(async (params: ExecuteTransferParams): Promise<TransferResult | null> => {
    if (!isSupabaseConfigured) return null;
    setLoading(true);
    setError(null);
    try {
      const result = await executeTransfer(params);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transfer failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { transfer, loading, error, clearError: () => setError(null) };
}
