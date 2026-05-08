import { BarChart3, CreditCard, LayoutDashboard, LogOut, Repeat2, Settings, WalletCards, X } from 'lucide-react';
import type { PageKey } from '../../types/finance';
import { cn } from '../../utils/format';

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  open: boolean;
  onClose: () => void;
}

const items: Array<{ key: PageKey | 'logout'; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'accounts', label: 'Accounts', icon: WalletCards },
  { key: 'transactions', label: 'Transactions', icon: CreditCard },
  { key: 'transfer', label: 'Transfer', icon: Repeat2 },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'logout', label: 'Logout', icon: LogOut }
];

export function Sidebar({ activePage, onNavigate, open, onClose }: SidebarProps) {
  return (
    <>
      <div className={cn('fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
      <aside className={cn('fixed left-0 top-0 z-50 flex h-dvh w-[280px] flex-col bg-white px-5 py-6 shadow-soft transition-transform duration-300 lg:sticky lg:z-auto lg:translate-x-0 lg:shadow-none', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">FinanceFlow</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Bank</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-neutral-100 p-2 lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav className="mt-10 grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.key === activePage;
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key !== 'logout') onNavigate(item.key);
                  onClose();
                }}
                className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition', active ? 'bg-graphite text-white shadow-card' : 'text-muted hover:bg-neutral-100 hover:text-graphite')}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto overflow-hidden rounded-[24px] bg-graphite p-5 text-white">
          <p className="text-lg font-extrabold">Premium Insights</p>
          <p className="mt-2 text-sm text-white/70">Smart alerts, budget limits and investment analytics.</p>
          <button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-graphite transition hover:bg-neutral-100">Upgrade</button>
        </div>
      </aside>
    </>
  );
}
