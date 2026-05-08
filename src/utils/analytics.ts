import type { Transaction, MonthlyPoint, CategorySpend } from '../types/finance';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_COLORS: string[] = [
  'bg-graphite', 'bg-success', 'bg-danger', 'bg-neutral-400', 'bg-neutral-200',
  'bg-blue-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400',
];

export function buildMonthlyData(transactions: Transaction[]): MonthlyPoint[] {
  const map = new Map<string, { income: number; expense: number }>();

  for (const tx of transactions) {
    const d = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = MONTH_LABELS[d.getMonth()];
    if (!map.has(key)) map.set(key, { income: 0, expense: 0 });
    const entry = map.get(key)!;
    if (tx.type === 'income') entry.income += tx.amount;
    else entry.expense += tx.amount;
    map.set(key, { ...entry });
  }

  // Sort by date and return last 9 months
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-9)
    .map(([key, val]) => {
      const [year, month] = key.split('-').map(Number);
      return { month: `${MONTH_LABELS[month]} ${year !== new Date().getFullYear() ? year : ''}`.trim(), ...val };
    });
}

export function buildCategorySpend(transactions: Transaction[]): CategorySpend[] {
  const expenses = transactions.filter((tx) => tx.type === 'expense');
  const total = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  if (total === 0) return [];

  const categoryMap = new Map<string, number>();
  for (const tx of expenses) {
    categoryMap.set(tx.category, (categoryMap.get(tx.category) ?? 0) + tx.amount);
  }

  return Array.from(categoryMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, amount], i) => ({
      name,
      value: Math.round((amount / total) * 100),
      colorClass: CATEGORY_COLORS[i] ?? 'bg-neutral-200',
    }));
}

export function getMonthlyTotals(transactions: Transaction[]): { income: number; expense: number } {
  const now = new Date();
  const current = transactions.filter((tx) => {
    const d = new Date(tx.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const income = current.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const expense = current.filter((tx) => tx.type !== 'income').reduce((s, tx) => s + tx.amount, 0);
  return { income, expense };
}

export function getAverageDailyExpense(transactions: Transaction[]): number {
  const expenses = transactions.filter((tx) => tx.type === 'expense');
  if (!expenses.length) return 0;
  const total = expenses.reduce((s, tx) => s + tx.amount, 0);
  return total / 30;
}

export function compareWithLastMonth(transactions: Transaction[]): { percentChange: number; isLower: boolean } {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentExpense = transactions
    .filter((tx) => tx.type === 'expense' && new Date(tx.createdAt) >= thisMonth)
    .reduce((s, tx) => s + tx.amount, 0);

  const previousExpense = transactions
    .filter((tx) => {
      const d = new Date(tx.createdAt);
      return tx.type === 'expense' && d >= lastMonth && d < thisMonth;
    })
    .reduce((s, tx) => s + tx.amount, 0);

  if (previousExpense === 0) return { percentChange: 0, isLower: false };
  const percentChange = Math.round(((currentExpense - previousExpense) / previousExpense) * 100);
  return { percentChange: Math.abs(percentChange), isLower: percentChange < 0 };
}

export function buildInsights(transactions: Transaction[]): string[] {
  const insights: string[] = [];
  const { percentChange, isLower } = compareWithLastMonth(transactions);

  if (percentChange > 0) {
    insights.push(
      isLower
        ? `You spent ${percentChange}% less than last month.`
        : `You spent ${percentChange}% more than last month.`
    );
  }

  const categorySpend = buildCategorySpend(transactions);
  if (categorySpend.length > 0) {
    const top = categorySpend[0];
    insights.push(`${top.name} is ${top.value}% of current expenses.`);
  }

  const income = transactions.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const expense = transactions.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  if (income > expense) {
    insights.push('Your savings rate is positive this period.');
  } else if (expense > income) {
    insights.push('Expenses exceed income — review your budget.');
  }

  return insights.length ? insights : ['Add transactions to see your financial insights.'];
}
