export type PageKey = 'dashboard' | 'accounts' | 'transactions' | 'transfer' | 'analytics' | 'settings';
export type CurrencyCode = 'USD' | 'EUR' | 'UZS' | 'RUB';
export type AccountType = 'checking' | 'savings' | 'card' | 'investment' | 'crypto';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  currency: CurrencyCode;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: CurrencyCode;
  number: string;
  trend: number;
  color: 'dark' | 'light' | 'green' | 'silver';
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  type: TransactionType;
  category: string;
  amount: number;
  title: string;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  merchant?: string;
}

export interface MonthlyPoint {
  month: string;
  income: number;
  expense: number;
}

export interface CategorySpend {
  name: string;
  value: number;
  colorClass: string;
}

export interface TransferPayload {
  fromAccountId: string;
  receiver: string;
  amount: number;
  comment: string;
}
