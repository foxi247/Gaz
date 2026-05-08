import { CreditCard, Plus } from 'lucide-react';
import type { Account } from '../types/finance';
import { cn, formatCurrency, formatPercent } from '../utils/format';

interface AccountCardProps {
  account: Account;
  active?: boolean;
  onSelect?: (id: string) => void;
}

const cardTone: Record<Account['color'], string> = {
  dark: 'bg-graphite text-white',
  green: 'bg-gradient-to-br from-[#174E38] to-[#111] text-white',
  silver: 'bg-gradient-to-br from-white to-neutral-200 text-graphite',
  light: 'bg-gradient-to-br from-neutral-100 to-white text-graphite'
};

export function AccountCard({ account, active, onSelect }: AccountCardProps) {
  return (
    <button
      onClick={() => onSelect?.(account.id)}
      className={cn(
        'pressable relative min-h-[190px] w-full overflow-hidden rounded-[28px] p-6 text-left shadow-card transition',
        cardTone[account.color],
        active && 'ring-4 ring-black/10'
      )}
    >
      <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 right-14 h-40 w-40 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm opacity-70">{account.type.toUpperCase()}</p>
          <h3 className="mt-2 text-xl font-bold">{account.name}</h3>
        </div>
        <CreditCard className="h-6 w-6 opacity-80" />
      </div>
      <div className="relative mt-9">
        <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(account.balance, account.currency)}</p>
        <div className="mt-4 flex items-center justify-between text-sm opacity-75">
          <span>{account.number}</span>
          <span>{formatPercent(account.trend)}</span>
        </div>
      </div>
    </button>
  );
}

export function NewAccountCard({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="pressable flex min-h-[190px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-neutral-300 bg-white/70 p-6 text-center shadow-card transition hover:bg-white">
      <span className="rounded-2xl bg-graphite p-4 text-white"><Plus className="h-6 w-6" /></span>
      <span className="mt-4 text-base font-bold">Create new account</span>
      <span className="mt-1 text-sm text-muted">Savings, card, crypto or investment</span>
    </button>
  );
}
