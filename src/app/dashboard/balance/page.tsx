'use client';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Coins, PlusCircle, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { secureStorage } from '../../../lib/auth-context';
import { useTranslation } from '@/lib/i18n-context';

interface Account {
  accountId: number;
  accountName: string;
  currency: string;
  currencySymbol: string;
  balance: number;
  formattedBalance: string;
  availableBalance: number;
  formattedAvailableBalance: string;
  reservedAmount: number;
  formattedReservedAmount: string;
}

interface AccountsResponse {
  success: boolean;
  accounts: Account[];
  creditBalance: number;
}

export default function BalancePage() {
  const [topupAmount, setTopupAmount] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  // Extract specific accounts
  const floatAccount = accounts.find(acc => acc.accountName === 'Agent Float A/C');
  const instantCommissionAccount = accounts.find(acc => acc.accountName === 'Agent Instant Commission A/C');
  const delayedCommissionAccount = accounts.find(acc => acc.accountName === 'Agent Delayed Commission A/C');

  const fetchAccountBalance = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const accessToken = secureStorage.getAccessToken();
      
      if (!accessToken) {
        throw new Error(t('balance.authRequired'));
      }

  const response = await fetch('https://core-api.ddin.rw/v1/agency/accounts/all/accounts/info/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t('balance.sessionExpired'));
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AccountsResponse = await response.json();

      if (!data.success) {
        throw new Error(t('balance.fetchFailed'));
      }

      setAccounts(data.accounts || []);
    } catch (err: any) {
      setError(err.message || t('balance.fetchFailed'));
      console.error('Error fetching account balances:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccountBalance();
  }, []);

  const handleTopup = () => {
    alert(`Topping up with RWF ${topupAmount}`);
    setTopupAmount('');
  };

  const handleRefresh = () => {
    fetchAccountBalance(true);
  };

  const toggleAmountsVisibility = () => {
    setShowAmounts(!showAmounts);
  };

  const formatHiddenAmount = (formattedAmount: string) => {
    return formattedAmount.replace(/[0-9]/g, '•');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#ff6600] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('balance.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{t('balance.error')}</h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              <button
                onClick={() => fetchAccountBalance()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                {t('balance.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-4xl"> {/* Reduced from max-w-7xl to max-w-4xl */}
        
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white text-center sm:text-left">
            {t('balance.title')}
          </h2>
          
          <div className="flex items-center gap-3">
            {/* Show/Hide Amounts Toggle */}
            <button
              onClick={toggleAmountsVisibility}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              {showAmounts ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('balance.hideAmounts')}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('balance.showAmounts')}</span>
                </>
              )}
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#13294b] dark:bg-[#ff6600] text-white rounded-xl hover:bg-[#0f213d] dark:hover:bg-[#e65c00] transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {refreshing ? t('balance.refreshing') : t('balance.refresh')}
              </span>
            </button>
          </div>
        </div>
        
        {/* User Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-[#13294b] to-[#ff6600] p-4 sm:p-6 rounded-2xl text-white text-center mb-6 sm:mb-8"
          >
            <p className="text-base sm:text-lg font-semibold">{t('balance.welcomeUser')} {user?.name || 'User'}</p>
            <p className="text-xs sm:text-sm opacity-90 mt-1">{t('balance.agentCategory')}: {user.category} • {t('balance.phone')}: {user.phoneNumber}</p>
            <p className="text-xs opacity-75 mt-2">{t('balance.lastUpdated')}: {new Date().toLocaleString()}</p>
          </motion.div>
        )}

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Float Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={toggleAmountsVisibility}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] rounded-full p-2 sm:p-3">
                <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('balance.floatBalance')}</p>
                <p className="text-xl sm:text-2xl font-bold text-[#ff6600] truncate">
                  {showAmounts 
                    ? (floatAccount ? floatAccount.formattedBalance : 'RWF 0.00')
                    : (floatAccount ? formatHiddenAmount(floatAccount.formattedBalance) : '••••••')
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {t('balance.available')}: {showAmounts 
                    ? (floatAccount ? floatAccount.formattedAvailableBalance : 'RWF 0.00')
                    : (floatAccount ? formatHiddenAmount(floatAccount.formattedAvailableBalance) : '••••••')
                  }
                </p>
                {floatAccount && floatAccount.reservedAmount > 0 && (
                  <p className="text-xs text-orange-500 mt-1 truncate">
                    {t('balance.reserved')}: {showAmounts 
                      ? floatAccount.formattedReservedAmount
                      : formatHiddenAmount(floatAccount.formattedReservedAmount)
                    }
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2 italic">
                  {t('balance.clickTo')} {showAmounts ? t('balance.hide') : t('balance.show')} {t('balance.amount')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Instant Commission Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={toggleAmountsVisibility}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#ff6600]/10 dark:bg-[#ff6600]/20 text-[#ff6600] rounded-full p-2 sm:p-3">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('balance.instantCommission')}</p>
                <p className="text-xl sm:text-2xl font-bold text-[#ff6600] dark:text-[#ff8c00] truncate">
                  {showAmounts 
                    ? (instantCommissionAccount ? instantCommissionAccount.formattedBalance : 'RWF 0.00')
                    : (instantCommissionAccount ? formatHiddenAmount(instantCommissionAccount.formattedBalance) : '••••••')
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">{t('balance.availableForWithdrawal')}</p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {t('balance.clickTo')} {showAmounts ? t('balance.hide') : t('balance.show')} {t('balance.amount')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Delayed Commission Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={toggleAmountsVisibility}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#13294b]/10 dark:bg-[#13294b]/30 text-[#13294b] dark:text-[#1a3a5f] rounded-full p-2 sm:p-3">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('balance.delayedCommission')}</p>
                <p className="text-xl sm:text-2xl font-bold text-[#13294b] dark:text-[#1a3a5f] truncate">
                  {showAmounts 
                    ? (delayedCommissionAccount ? delayedCommissionAccount.formattedBalance : 'RWF 0.00')
                    : (delayedCommissionAccount ? formatHiddenAmount(delayedCommissionAccount.formattedBalance) : '••••••')
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">{t('balance.pendingClearance')}</p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {t('balance.clickTo')} {showAmounts ? t('balance.hide') : t('balance.show')} {t('balance.amount')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top-Up Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all mb-6 sm:mb-8"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center sm:text-left">
            {t('balance.topUpFloat')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1 min-w-0">
              <input
                type="number"
                placeholder={t('balance.enterAmount')}
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6600] text-sm sm:text-base"
              />
            </div>
            <button
              onClick={handleTopup}
              disabled={!topupAmount}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00] transition disabled:opacity-50 font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('balance.topUpNow')}
            </button>
          </div>
        </motion.div>

        {/* Account Details Table */}
        {accounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {t('balance.allAccountsSummary')}
              </h3>
              <button
                onClick={toggleAmountsVisibility}
                className="flex items-center gap-2 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {showAmounts ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showAmounts ? t('balance.hideAmounts') : t('balance.showAmounts')}
              </button>
            </div>
            
            <div className="overflow-x-auto -mx-2 sm:-mx-0">
              <div className="min-w-full inline-block align-middle">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 sm:py-3 font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-3">{t('balance.accountName')}</th>
                      <th className="text-right py-2 sm:py-3 font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-3">{t('balance.balance')}</th>
                      <th className="text-right py-2 sm:py-3 font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-3 hidden sm:table-cell">{t('balance.available')}</th>
                      <th className="text-right py-2 sm:py-3 font-medium text-gray-500 dark:text-gray-400 px-2 sm:px-3 hidden md:table-cell">{t('balance.reserved')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.accountId} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 sm:py-3 text-gray-900 dark:text-white px-2 sm:px-3 truncate max-w-[120px] sm:max-w-none">
                          {account.accountName}
                        </td>
                        <td className="py-2 sm:py-3 text-right font-medium text-[#ff6600] px-2 sm:px-3 whitespace-nowrap">
                          {showAmounts ? account.formattedBalance : formatHiddenAmount(account.formattedBalance)}
                        </td>
                        <td className="py-2 sm:py-3 text-right text-gray-600 dark:text-gray-300 px-2 sm:px-3 whitespace-nowrap hidden sm:table-cell">
                          {showAmounts ? account.formattedAvailableBalance : formatHiddenAmount(account.formattedAvailableBalance)}
                        </td>
                        <td className="py-2 sm:py-3 text-right text-gray-500 dark:text-gray-400 px-2 sm:px-3 whitespace-nowrap hidden md:table-cell">
                          {showAmounts ? account.formattedReservedAmount : formatHiddenAmount(account.formattedReservedAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
