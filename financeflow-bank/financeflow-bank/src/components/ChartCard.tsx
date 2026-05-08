import { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ChartCardProps { title: string; subtitle?: string; children: ReactNode; action?: boolean; }

export function ChartCard({ title, subtitle, children, action = true }: ChartCardProps) {
  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {action && <button className="rounded-full bg-neutral-100 p-2 transition hover:bg-neutral-200"><ArrowUpRight className="h-5 w-5" /></button>}
      </div>
      {children}
    </section>
  );
}
