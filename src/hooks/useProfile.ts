import { useState, useEffect } from 'react';
import { user as mockUser } from '../data/mockData';
import type { UserProfile } from '../types/finance';
import { isSupabaseConfigured } from '../lib/supabase';
import { getCurrentUserProfile } from '../services/users';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile>(mockUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || userId === mockUser.id) return;
    setLoading(true);
    getCurrentUserProfile(userId)
      .then((data) => { if (data) setProfile(data); })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, setProfile, loading, error };
}
