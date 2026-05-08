import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Account, TransferPayload } from '../types/finance';
import { formatCurrency } from '../utils/format';

interface TransferFormProps {
  accounts: Account[];
  onTransfer: (payload: TransferPayload) => Promise<void>;
}

export function TransferForm({ accounts, onTransfer }: TransferFormProps) {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id ?? '');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const account = useMemo(() => accounts.find((item) => item.id === fromAccountId), [accounts, fromAccountId]);
  const numericAmount = Number(amount);
  const valid =
    fromAccountId &&
    receiver.trim().length > 2 &&
    numericAmount > 0 &&
    account &&
    numericAmount <= account.balance &&
    !submitting;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      await onTransfer({ fromAccountId, receiver, amount: numericAmount, comment });
      setConfirmed(true);
      setAmount('');
      setComment('');
      setReceiver('');
      setTimeout(() => setConfirmed(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card grid gap-5 p-5 sm:p-7">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Send transfer</h2>
        <p className="mt-1 text-sm text-muted">Securely move funds between accounts or to recipients.</p>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        From account
        <select
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value)}
          className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-semibold"
        >
          {accounts.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {formatCurrency(item.balance, item.currency)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Recipient
        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Name, email or wallet ID"
          className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-semibold"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Amount
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="1"
          step="1"
          placeholder="0.00"
          className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-2xl font-extrabold"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Comment
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Optional payment note"
          className="focus-ring resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-semibold"
        />
      </label>

      {account && numericAmount > account.balance && (
        <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
          Amount exceeds selected account balance.
        </p>
      )}

      {error && (
        <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{error}</p>
      )}

      <button
        disabled={!valid}
        className="pressable flex items-center justify-center gap-3 rounded-2xl bg-graphite px-5 py-4 font-extrabold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? 'Sending…' : 'Send transfer'}
        <ArrowRight className="h-5 w-5" />
      </button>

      {confirmed && (
        <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3 text-success">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-bold">Transfer completed successfully.</span>
        </div>
      )}
    </form>
  );
}
