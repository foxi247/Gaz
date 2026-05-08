# FinanceFlow Bank

A modern responsive virtual banking dashboard built with React, TypeScript and Tailwind CSS. The current version uses mock data and is structured for a future Supabase integration.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```txt
src/
  components/          Reusable UI blocks: Sidebar, Header, cards, tables, charts, transfer form
  components/charts/   Lightweight CSS/SVG-style chart components without heavy chart libraries
  components/layout/   Desktop sidebar, top header and mobile navigation
  data/                Mock user, accounts, transactions, chart and category data
  hooks/               Reusable hooks such as toast notifications
  lib/                 Supabase client placeholder
  pages/               Dashboard, Accounts, Transactions, Transfer, Analytics, Settings
  services/            Future API/service boundaries for Supabase
  types/               Finance domain types and future Supabase database types
  utils/               Formatting helpers and className utility
```

## Future Supabase schema

```sql
create table public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  type text not null,
  balance numeric(14,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  type text not null check (type in ('income', 'expense', 'transfer')),
  category text not null,
  amount numeric(14,2) not null,
  title text not null,
  description text,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  sender_user_id uuid not null references public.users(id),
  receiver_user_id uuid references public.users(id),
  from_account_id uuid not null references public.accounts(id),
  to_account_id uuid references public.accounts(id),
  amount numeric(14,2) not null,
  comment text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  type text not null,
  color text not null,
  icon text
);
```

## Where to connect Supabase later

- `src/lib/supabase.ts`: create the typed Supabase client.
- `src/types/database.ts`: replace the placeholder with generated Supabase types.
- `src/services/accounts.ts`: fetch and create accounts.
- `src/services/transactions.ts`: fetch, filter and create transactions.
- `src/services/transfers.ts`: implement atomic transfer logic through RPC or an Edge Function.
