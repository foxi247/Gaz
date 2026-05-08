import { Brain, CalendarDays, PiggyBank, TrendingDown } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import type { Account, CategorySpend, MonthlyPoint, Transaction } from '../types/finance';
import { formatCurrency } from '../utils/format';
import { getAverageDailyExpense, compareWithLastMonth, buildInsights } from '../utils/analytics';

interface AnalyticsProps {
  monthlyData: MonthlyPoint[];
  categorySpend: CategorySpend[];
  transactions: Transaction[];
  accounts: Account[];
}

export function Analytics({ monthlyData, categorySpend, transactions, accounts }: AnalyticsProps) {
  const averageDaily = getAverageDailyExpense(transactions);
  const { percentChange, isLower } = compareWithLastMonth(transactions);
  const insights = buildInsights(transactions);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const income = transactions.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const expense = transactions.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  const forecast = totalBalance + income - expense;

  const trendLabel = percentChange === 0
    ? 'No change vs last month.'
    : `${percentChange}% ${isLower ? 'lower' : 'higher'} than last month.`;

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: TrendingDown,
            title: 'Expense trend',
            value: percentChange === 0 ? 'No data' : `${percentChange}% ${isLower ? 'lower' : 'higher'}`,
            text: trendLabel,
          },
          {
            icon: CalendarDays,
            title: 'Daily average',
            value: formatCurrency(averageDaily),
            text: 'Average daily spending this period.',
          },
          {
            icon: PiggyBank,
            title: 'Balance forecast',
            value: formatCurrency(forecast),
            text: 'Projected balance based on current activity.',
          },
        ].map((item) => (
          <section key={item.title} className="glass-card p-5">
            <item.icon className="h-6 w-6 text-success" />
            <h3 className="mt-5 text-sm font-bold text-muted">{item.title}</h3>
            <p className="mt-1 text-2xl font-extrabold">{item.value}</p>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
        <ChartCard title="Financial pulse" subtitle="Income and expense comparison">
          {monthlyData.length > 0
            ? <BarChart data={monthlyData} />
            : <EmptyChart message="No monthly data yet" />}
        </ChartCard>
        <ChartCard title="Category split" action={false}>
          {categorySpend.length > 0
            ? <DonutChart data={categorySpend} />
            : <EmptyChart message="No expense data yet" />}
        </ChartCard>
      </div>

      <section className="glass-card p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Brain className="h-5 w-5" /> Smart insights
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {insights.map((text) => (
            <div key={text} className="rounded-2xl bg-neutral-100 p-4 text-sm font-bold text-graphite">
              {text}
            </div>
          ))}
        </div>
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
