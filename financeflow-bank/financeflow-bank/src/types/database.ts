// Supabase database schema types.
// To regenerate from your project: npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DbAccountType = 'checking' | 'savings' | 'card' | 'investment' | 'crypto';
export type DbTransactionType = 'income' | 'expense' | 'transfer';
export type DbTransactionStatus = 'completed' | 'pending' | 'failed';
export type DbTransferStatus = 'completed' | 'pending' | 'failed';
export type DbCategoryType = 'income' | 'expense';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: DbAccountType;
          balance: number;
          currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: DbAccountType;
          balance?: number;
          currency?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          type?: DbAccountType;
          balance?: number;
          currency?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          type: DbTransactionType;
          category: string;
          amount: number;
          title: string;
          description: string | null;
          status: DbTransactionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          type: DbTransactionType;
          category: string;
          amount: number;
          title: string;
          description?: string | null;
          status?: DbTransactionStatus;
          created_at?: string;
        };
        Update: {
          category?: string;
          amount?: number;
          title?: string;
          description?: string | null;
          status?: DbTransactionStatus;
        };
        Relationships: [];
      };
      transfers: {
        Row: {
          id: string;
          sender_user_id: string;
          receiver_user_id: string | null;
          from_account_id: string;
          to_account_id: string | null;
          amount: number;
          comment: string | null;
          status: DbTransferStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_user_id: string;
          receiver_user_id?: string | null;
          from_account_id: string;
          to_account_id?: string | null;
          amount: number;
          comment?: string | null;
          status?: DbTransferStatus;
          created_at?: string;
        };
        Update: {
          status?: DbTransferStatus;
          comment?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: DbCategoryType;
          color: string;
          icon: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: DbCategoryType;
          color: string;
          icon?: string | null;
        };
        Update: {
          name?: string;
          type?: DbCategoryType;
          color?: string;
          icon?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
