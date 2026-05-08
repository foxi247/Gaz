-- ============================================================
-- FinanceFlow Bank — Seed Data
-- ============================================================
-- IMPORTANT: Replace the placeholder UUID below with your real
-- auth user ID. You can find it after signing up:
--   select auth.uid();
-- or in Supabase Dashboard → Authentication → Users
-- ============================================================

-- Set your user id here (copy from auth.users or run: select auth.uid())
do $$
declare
  v_user_id   uuid := 'YOUR-AUTH-USER-UUID-HERE';  -- ← replace this
  v_acc1_id   uuid := gen_random_uuid();
  v_acc2_id   uuid := gen_random_uuid();
  v_acc3_id   uuid := gen_random_uuid();
  v_acc4_id   uuid := gen_random_uuid();
begin

-- Upsert user profile (trigger should handle this on signup, but seed it just in case)
insert into public.users (id, full_name, email, avatar_url)
values (v_user_id, 'Farhad Karimov', 'farhad@financeflow.bank', null)
on conflict (id) do nothing;

-- Accounts
insert into public.accounts (id, user_id, name, type, balance, currency) values
  (v_acc1_id, v_user_id, 'Main Balance',    'checking',   23902, 'USD'),
  (v_acc2_id, v_user_id, 'Savings Vault',   'savings',    18450, 'USD'),
  (v_acc3_id, v_user_id, 'Premium Card',    'card',        6240, 'USD'),
  (v_acc4_id, v_user_id, 'Invest & Crypto', 'investment', 11870, 'USD');

-- Transactions
insert into public.transactions (user_id, account_id, type, category, amount, title, description, status, created_at) values
  (v_user_id, v_acc1_id, 'income',   'Salary',        5200, 'Salary deposit',    'Acme Inc payroll',         'completed', '2024-09-28T09:15:00Z'),
  (v_user_id, v_acc3_id, 'expense',  'Housing',       1450, 'Apartment rent',    'September rent',           'completed', '2024-09-27T12:10:00Z'),
  (v_user_id, v_acc3_id, 'expense',  'Food',           184, 'Grocery market',    'Weekly groceries',         'completed', '2024-09-25T18:43:00Z'),
  (v_user_id, v_acc1_id, 'transfer', 'Transfer',       750, 'Transfer to Aziz',  'Project reimbursement',    'pending',   '2024-09-24T14:24:00Z'),
  (v_user_id, v_acc4_id, 'expense',  'Investments',    900, 'ETF purchase',      'Monthly investment',       'completed', '2024-09-20T16:30:00Z'),
  (v_user_id, v_acc2_id, 'income',   'Interest',        86, 'Savings interest',  'Monthly yield',            'completed', '2024-09-18T11:00:00Z'),
  (v_user_id, v_acc3_id, 'expense',  'Transport',       62, 'Ride services',     'Airport rides',            'failed',    '2024-09-14T06:50:00Z'),
  (v_user_id, v_acc1_id, 'expense',  'Subscriptions',   49, 'SaaS tools',        'Design and cloud apps',    'completed', '2024-09-12T10:12:00Z');

-- Default categories
insert into public.categories (user_id, name, type, color, icon) values
  (v_user_id, 'Salary',        'income',  '#22c55e', 'briefcase'),
  (v_user_id, 'Interest',      'income',  '#3b82f6', 'trending-up'),
  (v_user_id, 'Housing',       'expense', '#1f2937', 'home'),
  (v_user_id, 'Food',          'expense', '#22c55e', 'shopping-cart'),
  (v_user_id, 'Transport',     'expense', '#ef4444', 'car'),
  (v_user_id, 'Investments',   'expense', '#9ca3af', 'bar-chart'),
  (v_user_id, 'Subscriptions', 'expense', '#a78bfa', 'credit-card'),
  (v_user_id, 'Transfer',      'expense', '#6b7280', 'arrow-right');

end $$;
