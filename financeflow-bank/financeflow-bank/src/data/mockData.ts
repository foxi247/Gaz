import type { Account, CategorySpend, MonthlyPoint, Transaction, UserProfile } from '../types/finance';

export const user: UserProfile = {
  id: 'user_001',
  fullName: 'Farhad Karimov',
  email: 'farhad@financeflow.bank',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80',
  currency: 'USD'
};

export const accounts: Account[] = [
  { id: 'acc_01', name: 'Main Balance', type: 'checking', balance: 23902, currency: 'USD', number: '**** 4821', trend: 4.2, color: 'dark' },
  { id: 'acc_02', name: 'Savings Vault', type: 'savings', balance: 18450, currency: 'USD', number: '**** 9104', trend: 7.8, color: 'green' },
  { id: 'acc_03', name: 'Premium Card', type: 'card', balance: 6240, currency: 'USD', number: '**** 5520', trend: -1.9, color: 'silver' },
  { id: 'acc_04', name: 'Invest & Crypto', type: 'investment', balance: 11870, currency: 'USD', number: 'BTC · ETF', trend: 2.6, color: 'light' }
];

export const transactions: Transaction[] = [
  { id: 'tx_01', userId: 'user_001', accountId: 'acc_01', type: 'income', category: 'Salary', amount: 5200, title: 'Salary deposit', description: 'Acme Inc payroll', status: 'completed', createdAt: '2024-09-28T09:15:00Z', merchant: 'Acme Inc' },
  { id: 'tx_02', userId: 'user_001', accountId: 'acc_03', type: 'expense', category: 'Housing', amount: 1450, title: 'Apartment rent', description: 'September rent', status: 'completed', createdAt: '2024-09-27T12:10:00Z', merchant: 'Urban Homes' },
  { id: 'tx_03', userId: 'user_001', accountId: 'acc_03', type: 'expense', category: 'Food', amount: 184, title: 'Grocery market', description: 'Weekly groceries', status: 'completed', createdAt: '2024-09-25T18:43:00Z', merchant: 'Fresh Mart' },
  { id: 'tx_04', userId: 'user_001', accountId: 'acc_01', type: 'transfer', category: 'Transfer', amount: 750, title: 'Transfer to Aziz', description: 'Project reimbursement', status: 'pending', createdAt: '2024-09-24T14:24:00Z', merchant: 'Aziz Rahimov' },
  { id: 'tx_05', userId: 'user_001', accountId: 'acc_04', type: 'expense', category: 'Investments', amount: 900, title: 'ETF purchase', description: 'Monthly investment', status: 'completed', createdAt: '2024-09-20T16:30:00Z', merchant: 'Flow Invest' },
  { id: 'tx_06', userId: 'user_001', accountId: 'acc_02', type: 'income', category: 'Interest', amount: 86, title: 'Savings interest', description: 'Monthly yield', status: 'completed', createdAt: '2024-09-18T11:00:00Z', merchant: 'FinanceFlow Bank' },
  { id: 'tx_07', userId: 'user_001', accountId: 'acc_03', type: 'expense', category: 'Transport', amount: 62, title: 'Ride services', description: 'Airport rides', status: 'failed', createdAt: '2024-09-14T06:50:00Z', merchant: 'MoveNow' },
  { id: 'tx_08', userId: 'user_001', accountId: 'acc_01', type: 'expense', category: 'Subscriptions', amount: 49, title: 'SaaS tools', description: 'Design and cloud apps', status: 'completed', createdAt: '2024-09-12T10:12:00Z', merchant: 'Cloud Suite' }
];

export const monthlyData: MonthlyPoint[] = [
  { month: 'Jan', income: 7200, expense: 4100 },
  { month: 'Feb', income: 6500, expense: 3800 },
  { month: 'Mar', income: 8600, expense: 4600 },
  { month: 'Apr', income: 5900, expense: 4300 },
  { month: 'May', income: 8300, expense: 5000 },
  { month: 'Jun', income: 6800, expense: 3900 },
  { month: 'Jul', income: 9100, expense: 5200 },
  { month: 'Aug', income: 7800, expense: 4700 },
  { month: 'Sep', income: 9350, expense: 4150 }
];

export const categorySpend: CategorySpend[] = [
  { name: 'Housing', value: 38, colorClass: 'bg-graphite' },
  { name: 'Food', value: 22, colorClass: 'bg-success' },
  { name: 'Transport', value: 14, colorClass: 'bg-danger' },
  { name: 'Investments', value: 18, colorClass: 'bg-neutral-400' },
  { name: 'Other', value: 8, colorClass: 'bg-neutral-200' }
];
