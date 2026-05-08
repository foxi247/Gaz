import type { CurrencyCode } from '../types/finance';

export const formatCurrency = (value: number, currency: CurrencyCode = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));

export const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
