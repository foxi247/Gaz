import { BarChart3, Home, Repeat2, Settings, WalletCards } from 'lucide-react';
import type { PageKey } from '../../types/finance';
import { cn } from '../../utils/format';

interface MobileNavProps { activePage: PageKey; onNavigate: (page: PageKey) => void; }

const items: Array<{ key: PageKey; icon: typeof Home; label: string }> = [
  { key: 'dashboard', icon: Home, label: 'Home' },
  { key: 'accounts', icon: WalletCards, label: 'Cards' },
  { key: 'transfer', icon: Repeat2, label: 'Pay' },
  { key: 'analytics', icon: BarChart3, label: 'Stats' },
  { key: 'settings', icon: Settings, label: 'More' }
];

export function MobileNav({ activePage, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-5 rounded-[26px] bg-graphite/95 p-2 text-white shadow-soft backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.key === activePage;
        return (
          <button key={item.key} onClick={() => onNavigate(item.key)} className={cn('flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold transition', active ? 'bg-white text-graphite' : 'text-white/65')}>
            <Icon className="h-5 w-5" />{item.label}
          </button>
        );
      })}
    </nav>
  );
}
