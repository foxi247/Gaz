import { ArrowDownLeft, ArrowUpRight, Repeat2 } from 'lucide-react';
import type { Transaction } from '../types/finance';
import { cn, formatCurrency, formatDate } from '../utils/format';

interface TransactionCardProps { transaction: Transaction; }

export function typeIcon(type: Transaction['type']) {
  if (type === 'income') return ArrowDownLeft;
  if (type === 'expense') return ArrowUpRight;
  return Repeat2;
}

export function statusClass(status: Transaction['status']) {
  return {
    completed: 'bg-success/10 text-success',
    pending: 'bg-neutral-200 text-graphite',
    failed: 'bg-danger/10 text-danger'
  }[status];
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const Icon = typeIcon(transaction.type);
  const isExpense = transaction.type === 'expense' || transaction.type === 'transfer';
  return (
    <article className="rounded-[22px] bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', isExpense ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success')}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h4 className="truncate font-bold">{transaction.title}</h4>
            <p className="truncate text-sm text-muted">{transaction.category} · {formatDate(transaction.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('font-extrabold', isExpense ? 'text-danger' : 'text-success')}>{isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}</p>
          <span className={cn('mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold', statusClass(transaction.status))}>{transaction.status}</span>
        </div>
      </div>
    </article>
  );
}
