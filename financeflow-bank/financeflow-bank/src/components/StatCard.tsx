import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import { formatCurrency, formatPercent, cn } from '../utils/format';
import type { CurrencyCode } from '../types/finance';

interface StatCardProps {
  title: string;
  value: number;
  currency?: CurrencyCode;
  trend: number;
  icon: LucideIcon;
  dark?: boolean;
}

export function StatCard({ title, value, currency = 'USD', trend, icon: Icon, dark }: StatCardProps) {
  const positive = trend >= 0;

  return (
    <section className={cn('glass-card pressable overflow-hidden p-5', dark && 'bg-graphite text-white')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn('text-sm font-medium', dark ? 'text-white/75' : 'text-muted')}>{title}</p>
          <h3 className="mt-4 text-2xl font-bold tracking-tight">{formatCurrency(value, currency)}</h3>
        </div>
        <div className={cn('rounded-2xl p-3', dark ? 'bg-white/10' : 'bg-neutral-100')}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
        {positive ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-danger" />}
        <span className={positive ? 'text-success' : 'text-danger'}>{formatPercent(trend)}</span>
        <span className={dark ? 'text-white/60' : 'text-muted'}>from last month</span>
      </div>
    </section>
  );
}
