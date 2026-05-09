import { useMemo, useState } from 'react';
import type { Transaction, TransactionType } from '../types/finance';
import { TransactionTable } from '../components/TransactionTable';
import { cn } from '../utils/format';

interface TransactionsProps {
  transactions: Transaction[];
  error?: string | null;
}

const filters: Array<'all' | TransactionType> = ['all', 'income', 'expense', 'transfer'];

export function Transactions({ transactions, error }: TransactionsProps) {
  const [type, setType] = useState<'all' | TransactionType>('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(transactions.map((tx) => tx.category)))],
    [transactions]
  );

  const filtered = useMemo(() => transactions.filter((tx) => {
    const matchesType = type === 'all' || tx.type === type;
    const matchesCategory = category === 'all' || tx.category === category;
    const matchesStatus = status === 'all' || tx.status === status;
    const searchable = `${tx.title} ${tx.description} ${tx.merchant ?? ''}`.toLowerCase();
    const matchesQuery = searchable.includes(query.toLowerCase());
    return matchesType && matchesCategory && matchesStatus && matchesQuery;
  }), [transactions, type, category, status, query]);

  if (error) {
    return (
      <section className="glass-card p-5 sm:p-6">
        <div className="grid min-h-[260px] place-items-center rounded-[24px] border border-dashed border-danger/30 bg-danger/5 p-8 text-center">
          <div>
            <p className="text-lg font-bold text-danger">Failed to load transactions</p>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Operations</h2>
          <p className="mt-1 text-sm text-muted">Search, filter and review all transactions.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search operation"
            className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setType(filter)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-extrabold transition',
              type === filter ? 'bg-graphite text-white' : 'bg-neutral-100 text-muted hover:text-graphite'
            )}
          >
            {filter[0].toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <TransactionTable transactions={filtered} emptyText="No transactions match your filters" />
    </section>
  );
}
