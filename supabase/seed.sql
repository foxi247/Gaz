-- ============================================================
-- FinanceFlow Bank — Seed Data
-- ============================================================
-- Запускай ПОСЛЕ того как зарегистрировался через приложение
-- (или создал пользователя в Supabase Dashboard → Authentication → Users)
--
-- UUID подставляется автоматически из первого auth-пользователя.
-- ============================================================

do $$
declare
  v_user_id   uuid;
  v_acc1_id   uuid := gen_random_uuid();
  v_acc2_id   uuid := gen_random_uuid();
  v_acc3_id   uuid := gen_random_uuid();
  v_acc4_id   uuid := gen_random_uuid();
begin

  -- Берём ID первого зарегистрированного пользователя
  select id into v_user_id from auth.users order by created_at limit 1;

  if v_user_id is null then
    raise exception
      'Нет auth-пользователей. Сначала зарегистрируйся в приложении, потом запусти seed.sql.';
  end if;

  raise notice 'Seeding for user_id: %', v_user_id;

  -- Профиль (trigger создаёт его при регистрации, но на всякий случай)
  insert into public.users (id, full_name, email, avatar_url)
  select v_user_id,
         coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
         email,
         null
  from auth.users where id = v_user_id
  on conflict (id) do nothing;

  -- Счета
  insert into public.accounts (id, user_id, name, type, balance, currency) values
    (v_acc1_id, v_user_id, 'Main Balance',    'checking',   23902, 'USD'),
    (v_acc2_id, v_user_id, 'Savings Vault',   'savings',    18450, 'USD'),
    (v_acc3_id, v_user_id, 'Premium Card',    'card',        6240, 'USD'),
    (v_acc4_id, v_user_id, 'Invest & Crypto', 'investment', 11870, 'USD');

  -- Транзакции
  insert into public.transactions (user_id, account_id, type, category, amount, title, description, status, created_at) values
    (v_user_id, v_acc1_id, 'income',   'Salary',        5200, 'Salary deposit',   'Acme Inc payroll',      'completed', now() - interval '10 days'),
    (v_user_id, v_acc3_id, 'expense',  'Housing',       1450, 'Apartment rent',   'September rent',        'completed', now() - interval '11 days'),
    (v_user_id, v_acc3_id, 'expense',  'Food',           184, 'Grocery market',   'Weekly groceries',      'completed', now() - interval '13 days'),
    (v_user_id, v_acc1_id, 'transfer', 'Transfer',       750, 'Transfer to Aziz', 'Project reimbursement', 'pending',   now() - interval '14 days'),
    (v_user_id, v_acc4_id, 'expense',  'Investments',    900, 'ETF purchase',     'Monthly investment',    'completed', now() - interval '18 days'),
    (v_user_id, v_acc2_id, 'income',   'Interest',        86, 'Savings interest', 'Monthly yield',         'completed', now() - interval '20 days'),
    (v_user_id, v_acc3_id, 'expense',  'Transport',       62, 'Ride services',    'Airport rides',         'failed',    now() - interval '24 days'),
    (v_user_id, v_acc1_id, 'expense',  'Subscriptions',   49, 'SaaS tools',       'Design and cloud apps', 'completed', now() - interval '26 days');

  -- Категории
  insert into public.categories (user_id, name, type, color, icon) values
    (v_user_id, 'Salary',        'income',  '#22c55e', 'briefcase'),
    (v_user_id, 'Interest',      'income',  '#3b82f6', 'trending-up'),
    (v_user_id, 'Housing',       'expense', '#1f2937', 'home'),
    (v_user_id, 'Food',          'expense', '#22c55e', 'shopping-cart'),
    (v_user_id, 'Transport',     'expense', '#ef4444', 'car'),
    (v_user_id, 'Investments',   'expense', '#9ca3af', 'bar-chart'),
    (v_user_id, 'Subscriptions', 'expense', '#a78bfa', 'credit-card'),
    (v_user_id, 'Transfer',      'expense', '#6b7280', 'arrow-right');

  raise notice 'Seed completed successfully!';
end $$;
