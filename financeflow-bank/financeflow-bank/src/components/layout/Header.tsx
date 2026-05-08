import { Bell, Menu, Search } from 'lucide-react';
import type { UserProfile } from '../../types/finance';

interface HeaderProps {
  user: UserProfile;
  title: string;
  onMenu: () => void;
}

export function Header({ user, title, onMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-5 bg-mist/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:bg-transparent lg:px-0 lg:py-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="rounded-2xl bg-white p-3 shadow-card lg:hidden"><Menu className="h-5 w-5" /></button>
          <div>
            <p className="text-sm font-semibold text-muted">Welcome back</p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="hidden min-w-[260px] items-center gap-2 rounded-full bg-white px-4 py-3 shadow-card md:flex">
            <Search className="h-4 w-4 text-muted" />
            <input className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted" placeholder="Search transactions..." />
          </label>
          <button className="relative rounded-full bg-white p-3 shadow-card transition hover:-translate-y-0.5">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white" />
          </button>
          <img src={user.avatarUrl} alt={user.fullName} className="h-11 w-11 rounded-full object-cover shadow-card" />
        </div>
      </div>
    </header>
  );
}
