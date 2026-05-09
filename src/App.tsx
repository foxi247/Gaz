import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/Toast';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import type { PageKey, TransferPayload } from './types/finance';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { Transfer } from './pages/Transfer';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { useAccounts } from './hooks/useAccounts';
import { useTransactions } from './hooks/useTransactions';
import { useProfile } from './hooks/useProfile';
import { isSupabaseConfigured } from './lib/supabase';
import { executeTransfer } from './services/transfers';
import { signOut } from './services/auth';
import { buildMonthlyData, buildCategorySpend } from './utils/analytics';
import { monthlyData as mockMonthlyData, categorySpend as mockCategorySpend } from './data/mockData';

const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  accounts: 'Accounts',
  transactions: 'Transactions',
  transfer: 'Transfer',
  analytics: 'Analytics',
  settings: 'Settings',
};

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const { message, showToast } = useToast();

  const { userId, isAuthenticated, loading: authLoading } = useAuth();
  const { profile } = useProfile(userId);
  const {
    accounts,
    setAccounts,
    loading: accountsLoading,
    error: accountsError,
    reload: reloadAccounts,
    addAccount,
  } = useAccounts(userId, isAuthenticated);
  const {
    transactions,
    loading: txLoading,
    error: txError,
    prependTransaction,
    reload: reloadTransactions,
  } = useTransactions(userId, isAuthenticated);

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [transactions]
  );

  const liveMode = isSupabaseConfigured && isAuthenticated;

  const monthlyData = useMemo(
    () => (liveMode ? buildMonthlyData(sortedTransactions) : mockMonthlyData),
    [liveMode, sortedTransactions]
  );

  const categorySpend = useMemo(
    () => (liveMode ? buildCategorySpend(sortedTransactions) : mockCategorySpend),
    [liveMode, sortedTransactions]
  );

  // Set selected account once accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  async function handleLogout() {
    try {
      await signOut();
    } catch {
      // session already gone
    }
  }

  function handleNavigate(page: PageKey) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleTransfer(payload: TransferPayload) {
    if (liveMode) {
      try {
        await executeTransfer({
          senderUserId: userId,
          fromAccountId: payload.fromAccountId,
          receiverName: payload.receiver,
          amount: payload.amount,
          comment: payload.comment || null,
        });
        await reloadAccounts();
        await reloadTransactions();
        showToast('Transfer sent successfully');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Transfer failed');
      }
    } else {
      setAccounts((current) =>
        current.map((acc) =>
          acc.id === payload.fromAccountId ? { ...acc, balance: acc.balance - payload.amount } : acc
        )
      );
      prependTransaction({
        id: `tx_${Date.now()}`,
        userId,
        accountId: payload.fromAccountId,
        type: 'transfer',
        category: 'Transfer',
        amount: payload.amount,
        title: `Transfer to ${payload.receiver}`,
        description: payload.comment || 'Outgoing transfer',
        status: 'completed',
        createdAt: new Date().toISOString(),
        merchant: payload.receiver,
      });
      showToast('Transfer sent successfully');
    }
  }

  const pageLoading = authLoading || accountsLoading || txLoading;

  return (
    <div className="min-h-dvh bg-mist text-graphite">
      <div className="mx-auto flex max-w-[1520px] gap-5 lg:p-6">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
        <main className="min-w-0 flex-1 px-4 pb-28 pt-3 sm:px-6 lg:px-0 lg:pb-0 lg:pt-0">
          <Header user={profile} title={pageTitles[activePage]} onMenu={() => setSidebarOpen(true)} />

          {pageLoading && activePage === 'dashboard' && <LoadingSkeleton variant="dashboard" />}
          {pageLoading && activePage === 'accounts' && <LoadingSkeleton variant="accounts" />}
          {pageLoading && activePage === 'transactions' && <LoadingSkeleton variant="transactions" />}

          {!pageLoading && activePage === 'dashboard' && (
            <Dashboard
              user={profile}
              accounts={accounts}
              transactions={sortedTransactions}
              monthlyData={monthlyData}
              categorySpend={categorySpend}
              onQuickAction={handleNavigate}
              error={accountsError ?? txError}
            />
          )}
          {!pageLoading && activePage === 'accounts' && (
            <Accounts
              accounts={accounts}
              selectedAccountId={selectedAccountId || (accounts[0]?.id ?? '')}
              onSelectAccount={setSelectedAccountId}
              onAddAccount={addAccount}
              error={accountsError}
            />
          )}
          {!pageLoading && activePage === 'transactions' && (
            <Transactions transactions={sortedTransactions} error={txError} />
          )}
          {activePage === 'transfer' && (
            <Transfer accounts={accounts} onTransfer={handleTransfer} />
          )}
          {activePage === 'analytics' && (
            <Analytics
              monthlyData={monthlyData}
              categorySpend={categorySpend}
              transactions={sortedTransactions}
              accounts={accounts}
            />
          )}
          {activePage === 'settings' && (
            <Settings user={profile} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          )}
        </main>
      </div>
      <MobileNav activePage={activePage} onNavigate={handleNavigate} />
      <Toast message={message} />
    </div>
  );
}
