import type { CategorySpend } from '../../types/finance';

interface DonutChartProps { data: CategorySpend[]; }

export function DonutChart({ data }: DonutChartProps) {
  const gradient = data.reduce((acc, item, index) => {
    const previous = data.slice(0, index).reduce((sum, segment) => sum + segment.value, 0);
    const color = ['#171717', '#18A058', '#E34B6A', '#9A9A9F', '#E4E4E7'][index] ?? '#DDD';
    return `${acc}${color} ${previous}% ${previous + item.value}%,`;
  }, '');
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${gradient.slice(0, -1)})` }}>
        <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center shadow-inner">
          <span className="text-2xl font-extrabold">62%</span>
          <span className="-mt-5 text-[11px] font-semibold text-muted">planned</span>
        </div>
      </div>
      <div className="grid flex-1 gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold"><i className={`h-3 w-3 rounded-full ${item.colorClass}`} />{item.name}</span>
            <span className="text-muted">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
