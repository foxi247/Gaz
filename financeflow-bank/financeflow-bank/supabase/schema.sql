-- ============================================================
-- FinanceFlow Bank — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Users (linked to auth.users)
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

create index if not exists users_email_idx on public.users(email);

-- Accounts
create table if not exists public.accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('checking','savings','card','investment','crypto')),
  balance     numeric(18,2) not null default 0 check (balance >= 0),
  currency    text not null default 'USD',
  created_at  timestamptz not null default now()
);

create index if not exists accounts_user_id_idx on public.accounts(user_id);
create index if not exists accounts_created_at_idx on public.accounts(created_at);

-- Transactions
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  account_id  uuid not null references public.accounts(id) on delete cascade,
  type        text not null check (type in ('income','expense','transfer')),
  category    text not null,
  amount      numeric(18,2) not null check (amount > 0),
  title       text not null,
  description text,
  status      text not null default 'completed' check (status in ('completed','pending','failed')),
  created_at  timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_account_id_idx on public.transactions(account_id);
create index if not exists transactions_created_at_idx on public.transactions(created_at desc);
create index if not exists transactions_type_idx on public.transactions(type);

-- Transfers
create table if not exists public.transfers (
  id                uuid primary key default gen_random_uuid(),
  sender_user_id    uuid not null references public.users(id),
  receiver_user_id  uuid references public.users(id),
  from_account_id   uuid not null references public.accounts(id),
  to_account_id     uuid references public.accounts(id),
  amount            numeric(18,2) not null check (amount > 0),
  comment           text,
  status            text not null default 'completed' check (status in ('completed','pending','failed')),
  created_at        timestamptz not null default now()
);

create index if not exists transfers_sender_idx on public.transfers(sender_user_id);
create index if not exists transfers_receiver_idx on public.transfers(receiver_user_id);
create index if not exists transfers_created_at_idx on public.transfers(created_at desc);

-- Categories
create table if not exists public.categories (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references public.users(id) on delete cascade,
  name     text not null,
  type     text not null check (type in ('income','expense')),
  color    text not null default '#6B7280',
  icon     text
);

create index if not exists categories_user_id_idx on public.categories(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.transfers enable row level security;
alter table public.categories enable row level security;

-- users: can read and update own profile
create policy "users: select own" on public.users
  for select using (auth.uid() = id);

create policy "users: insert own" on public.users
  for insert with check (auth.uid() = id);

create policy "users: update own" on public.users
  for update using (auth.uid() = id);

-- accounts
create policy "accounts: select own" on public.accounts
  for select using (auth.uid() = user_id);

create policy "accounts: insert own" on public.accounts
  for insert with check (auth.uid() = user_id);

create policy "accounts: update own" on public.accounts
  for update using (auth.uid() = user_id);

create policy "accounts: delete own" on public.accounts
  for delete using (auth.uid() = user_id);

-- transactions
create policy "transactions: select own" on public.transactions
  for select using (auth.uid() = user_id);

create policy "transactions: insert own" on public.transactions
  for insert with check (auth.uid() = user_id);

create policy "transactions: update own" on public.transactions
  for update using (auth.uid() = user_id);

create policy "transactions: delete own" on public.transactions
  for delete using (auth.uid() = user_id);

-- transfers: sender or receiver can view
create policy "transfers: select as sender or receiver" on public.transfers
  for select using (
    auth.uid() = sender_user_id or auth.uid() = receiver_user_id
  );

create policy "transfers: insert as sender" on public.transfers
  for insert with check (auth.uid() = sender_user_id);

-- categories
create policy "categories: select own" on public.categories
  for select using (auth.uid() = user_id);

create policy "categories: insert own" on public.categories
  for insert with check (auth.uid() = user_id);

create policy "categories: update own" on public.categories
  for update using (auth.uid() = user_id);

create policy "categories: delete own" on public.categories
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create user profile on sign-up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Optional RPC: execute_transfer (atomic, use instead of
-- the sequential frontend calls in src/services/transfers.ts)
-- ============================================================
create or replace function public.execute_transfer(
  p_sender_user_id    uuid,
  p_receiver_user_id  uuid,
  p_from_account_id   uuid,
  p_to_account_id     uuid,
  p_amount            numeric,
  p_comment           text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_from_balance  numeric;
  v_transfer_id   uuid;
begin
  -- Check balance
  select balance into v_from_balance
  from public.accounts
  where id = p_from_account_id and user_id = p_sender_user_id
  for update;

  if v_from_balance is null then
    raise exception 'Source account not found';
  end if;

  if v_from_balance < p_amount then
    raise exception 'Insufficient balance';
  end if;

  -- Create transfer record
  insert into public.transfers
    (sender_user_id, receiver_user_id, from_account_id, to_account_id, amount, comment, status)
  values
    (p_sender_user_id, p_receiver_user_id, p_from_account_id, p_to_account_id, p_amount, p_comment, 'completed')
  returning id into v_transfer_id;

  -- Debit sender
  update public.accounts set balance = balance - p_amount where id = p_from_account_id;

  -- Credit receiver
  if p_to_account_id is not null then
    update public.accounts set balance = balance + p_amount where id = p_to_account_id;
  end if;

  -- Sender transaction
  insert into public.transactions
    (user_id, account_id, type, category, amount, title, description, status)
  values
    (p_sender_user_id, p_from_account_id, 'transfer', 'Transfer', p_amount,
     'Outgoing transfer', p_comment, 'completed');

  -- Receiver transaction
  if p_to_account_id is not null and p_receiver_user_id is not null then
    insert into public.transactions
      (user_id, account_id, type, category, amount, title, description, status)
    values
      (p_receiver_user_id, p_to_account_id, 'transfer', 'Transfer', p_amount,
       'Incoming transfer', p_comment, 'completed');
  end if;

  return v_transfer_id;
end;
$$;
