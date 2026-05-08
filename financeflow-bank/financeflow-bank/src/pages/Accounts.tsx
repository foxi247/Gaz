import { useState } from 'react';
import { X } from 'lucide-react';
import { AccountCard, NewAccountCard } from '../components/AccountCard';
import type { Account, AccountType, CurrencyCode } from '../types/finance';

interface AccountsProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  onAddAccount?: (payload: { name: string; type: AccountType; currency?: CurrencyCode }) => Promise<void>;
  error?: string | null;
}

export function Accounts({ accounts, selectedAccountId, onSelectAccount, onAddAccount, error }: AccountsProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) { setFormError('Account name is required'); return; }
    setSaving(true);
    setFormError(null);
    try {
      await onAddAccount?.({ name: name.trim(), type, currency });
      setShowModal(false);
      setName('');
      setType('checking');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <section className="glass-card p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Your balances</h2>
            <p className="mt-1 text-sm text-muted">Select an account to view details.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="pressable rounded-2xl bg-graphite px-5 py-3 font-extrabold text-white shadow-card"
          >
            Create new account
          </button>
        </div>
        {error && <p className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{error}</p>}
      </section>

      {accounts.length === 0 && !error && (
        <div className="grid min-h-[220px] place-items-center rounded-[28px] border border-dashed border-neutral-300 bg-white/70 p-8 text-center shadow-card">
          <div>
            <p className="text-lg font-bold">No accounts yet</p>
            <p className="mt-1 text-sm text-muted">Create your first account to get started.</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            active={selectedAccountId === account.id}
            onSelect={onSelectAccount}
          />
        ))}
        <NewAccountCard onClick={() => setShowModal(true)} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-extrabold">New account</h3>
              <button onClick={() => setShowModal(false)} className="pressable rounded-2xl p-2 hover:bg-neutral-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-bold">
                Account name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Balance"
                  className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="card">Card</option>
                  <option value="investment">Investment</option>
                  <option value="crypto">Crypto</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Currency
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="focus-ring rounded-2xl border border-neutral-200 px-4 py-3"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="UZS">UZS</option>
                  <option value="RUB">RUB</option>
                </select>
              </label>
              {formError && (
                <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{formError}</p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 font-bold hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="pressable flex-1 rounded-2xl bg-graphite px-5 py-3 font-extrabold text-white shadow-card disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
