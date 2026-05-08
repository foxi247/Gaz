import type { Transaction } from '../types/finance';
import { cn, formatCurrency, formatDate } from '../utils/format';
import { TransactionCard, statusClass, typeIcon } from './TransactionCard';

interface TransactionTableProps { transactions: Transaction[]; emptyText?: string; }

export function TransactionTable({ transactions, emptyText = 'No transactions found' }: TransactionTableProps) {
  if (!transactions.length) {
    return (
      <div className="grid min-h-[260px] place-items-center rounded-[24px] border border-dashed border-neutral-300 bg-white/70 p-8 text-center">
        <div>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-neutral-100" />
          <h3 className="text-lg font-bold">{emptyText}</h3>
          <p className="mt-1 text-sm text-muted">Try changing filters or add a new transfer.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden overflow-hidden rounded-[24px] border border-neutral-200 bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-4">Operation</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {transactions.map((transaction) => {
              const Icon = typeIcon(transaction.type);
              const isExpense = transaction.type === 'expense' || transaction.type === 'transfer';
              return (
                <tr key={transaction.id} className="transition hover:bg-neutral-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={cn('grid h-10 w-10 place-items-center rounded-2xl', isExpense ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success')}><Icon className="h-5 w-5" /></span>
                      <div>
                        <p className="font-bold">{transaction.title}</p>
                        <p className="text-xs text-muted">{transaction.merchant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-muted">{transaction.category}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(transaction.createdAt)}</td>
                  <td className={cn('px-5 py-4 font-extrabold', isExpense ? 'text-danger' : 'text-success')}>{isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}</td>
                  <td className="px-5 py-4"><span className={cn('rounded-full px-3 py-1 text-xs font-bold', statusClass(transaction.status))}>{transaction.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)}
      </div>
    </div>
  );
}
