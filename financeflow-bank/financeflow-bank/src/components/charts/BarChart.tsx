import type { MonthlyPoint } from '../../types/finance';

interface BarChartProps { data: MonthlyPoint[]; compact?: boolean; }

export function BarChart({ data, compact }: BarChartProps) {
  const max = Math.max(...data.flatMap((item) => [item.income, item.expense]));
  return (
    <div className="h-full min-h-[240px] w-full">
      <div className="flex h-[220px] items-end justify-between gap-3 sm:gap-5">
        {data.map((item) => {
          const incomeHeight = (item.income / max) * 100;
          const expenseHeight = (item.expense / max) * 100;
          return (
            <div key={item.month} className="flex flex-1 flex-col items-center justify-end gap-3">
              <div className="flex h-44 w-full items-end justify-center gap-1.5">
                <div className="w-3 rounded-full bg-graphite shadow-sm sm:w-5" style={{ height: `${incomeHeight}%` }} title={`Income ${item.income}`} />
                <div className="w-3 rounded-full bg-danger/80 shadow-sm sm:w-5" style={{ height: `${expenseHeight}%` }} title={`Expense ${item.expense}`} />
              </div>
              {!compact && <span className="text-xs font-semibold text-muted">{item.month}</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center gap-5 text-xs font-semibold text-muted">
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-graphite" />Income</span>
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-danger" />Expense</span>
      </div>
    </div>
  );
}
