import { ShieldCheck, Zap } from 'lucide-react';
import { TransferForm } from '../components/TransferForm';
import type { Account, TransferPayload } from '../types/finance';
import { formatCurrency } from '../utils/format';
import { isSupabaseConfigured } from '../lib/supabase';

interface TransferProps {
  accounts: Account[];
  onTransfer: (payload: TransferPayload) => Promise<void>;
}

const RECENT_RECIPIENTS = ['Aziz Rahimov', 'Maya Collins', 'Alex Chen'];

export function Transfer({ accounts, onTransfer }: TransferProps) {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <TransferForm accounts={accounts} onTransfer={onTransfer} />
      <aside className="grid gap-5">
        <section className="overflow-hidden rounded-[28px] bg-graphite p-7 text-white shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/60">Available across accounts</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight">{formatCurrency(total)}</h2>
            </div>
            <ShieldCheck className="h-8 w-8 text-success" />
          </div>
          <p className="mt-10 max-w-sm text-sm leading-6 text-white/70">
            {isSupabaseConfigured
              ? 'Balance validation and transfer are handled securely via Supabase.'
              : 'Connect Supabase to enable real balance validation and persistent transfers.'}
          </p>
        </section>
        <section className="glass-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-extrabold">
            <Zap className="h-5 w-5" /> Recent recipients
          </h3>
          <div className="mt-5 grid gap-3">
            {RECENT_RECIPIENTS.map((name) => (
              <button
                key={name}
                className="flex items-center justify-between rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-bold transition hover:bg-neutral-200"
              >
                <span>{name}</span>
                <span className="text-muted">Send</span>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
