import { Activity, ArrowDownRight, ArrowUpRight, Landmark, ReceiptText } from 'lucide-react';
import type { Account, CategorySpend, MonthlyPoint, Transaction, UserProfile } from '../types/finance';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { TransactionTable } from '../components/TransactionTable';
import { formatCurrency } from '../utils/format';
import { getMonthlyTotals } from '../utils/analytics';

interface DashboardProps {
  user: UserProfile;
  accounts: Account[];
  transactions: Transaction[];
  monthlyData: MonthlyPoint[];
  categorySpend: CategorySpend[];
  onQuickAction: (page: 'transfer' | 'transactions') => void;
  error?: string | null;
}

export function Dashboard({ user, accounts, transactions, monthlyData, categorySpend, onQuickAction, error }: DashboardProps) {
  const balance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const { income, expense } = getMonthlyTotals(transactions);
  const profit = income - expense;

  if (error) {
    return (
      <div className="grid min-h-[300px] place-items-center rounded-[28px] border border-dashed border-danger/30 bg-danger/5 p-10 text-center">
        <div>
          <p className="text-lg font-bold text-danger">Failed to load dashboard</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Balance" value={balance} trend={4.2} icon={Landmark} dark currency={user.currency} />
        <StatCard title="Monthly Income" value={income} trend={7.1} icon={ArrowDownRight} currency={user.currency} />
        <StatCard title="Monthly Expense" value={expense} trend={-2.9} icon={ArrowUpRight} currency={user.currency} />
        <StatCard title="Net Profit" value={profit} trend={3.6} icon={Activity} currency={user.currency} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <ChartCard title="Income & expense flow" subtitle="Monthly overview">
          {monthlyData.length > 0
            ? <BarChart data={monthlyData} />
            : <EmptyChart message="No monthly data yet" />}
        </ChartCard>
        <div className="grid gap-5">
          <section className="glass-card p-5 sm:p-6">
            <h2 className="text-xl font-bold">Quick actions</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {(['Top up', 'Transfer', 'Pay bills', 'Add expense'] as const).map((label) => (
                <button
                  key={label}
                  onClick={() => onQuickAction(label === 'Transfer' ? 'transfer' : 'transactions')}
                  className="pressable rounded-2xl bg-neutral-100 px-4 py-4 text-sm font-extrabold transition hover:bg-graphite hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
          <ChartCard title="Expense categories" action={false}>
            {categorySpend.length > 0
              ? <DonutChart data={categorySpend} />
              : <EmptyChart message="No expense data yet" />}
          </ChartCard>
        </div>
      </div>

      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Latest transactions</h2>
            <p className="text-sm text-muted">
              {transactions.length} operations · {formatCurrency(profit, user.currency)} net
            </p>
          </div>
          <ReceiptText className="h-6 w-6 text-muted" />
        </div>
        <TransactionTable
          transactions={transactions.slice(0, 5)}
          emptyText="No transactions yet"
        />
      </section>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="grid min-h-[180px] place-items-center text-center">
      <p className="text-sm font-semibold text-muted">{message}</p>
    </div>
  );
}
