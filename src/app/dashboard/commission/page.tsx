'use client';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Coins, Download, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
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

interface WithdrawResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export default function CommissionPage() {
  const { t } = useTranslation();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Extract commission accounts
  const instantCommissionAccount = accounts.find(acc => acc.accountName === 'Agent Instant Commission A/C');
  const delayedCommissionAccount = accounts.find(acc => acc.accountName === 'Agent Delayed Commission A/C');

  const MIN_WITHDRAWAL_AMOUNT = 5000; // Minimum withdrawal amount
  const availableBalance = instantCommissionAccount ? instantCommissionAccount.availableBalance : 0;

  const fetchCommissionBalance = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const accessToken = secureStorage.getAccessToken();
      
      if (!accessToken) {
        throw new Error(t('commission.authRequired'));
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
          throw new Error(t('commission.sessionExpired'));
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AccountsResponse = await response.json();

      if (!data.success) {
        throw new Error(t('commission.fetchFailed'));
      }

      setAccounts(data.accounts || []);
    } catch (err: any) {
      setError(err.message || t('commission.fetchFailed'));
      console.error('Error fetching commission balances:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const validateAmount = (amount: string): string => {
    if (!amount) return '';
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return t('commission.validAmount');
    }
    
    if (numAmount < MIN_WITHDRAWAL_AMOUNT) {
      return t('commission.minWithdrawal', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() });
    }
    
    if (numAmount > availableBalance) {
      return t('commission.exceedsBalance', { amount: availableBalance.toLocaleString() });
    }
    
    return '';
  };

  const handleAmountChange = (amount: string) => {
    setWithdrawAmount(amount);
    setWithdrawError('');
    setWithdrawSuccess('');
    
    const validationMsg = validateAmount(amount);
    setValidationError(validationMsg);
  };

  const handleWithdraw = async () => {
    const validationMsg = validateAmount(withdrawAmount);
    if (validationMsg) {
      setWithdrawError(validationMsg);
      return;
    }

    if (!instantCommissionAccount) {
      setWithdrawError(t('commission.accountNotAvailable'));
      return;
    }

    const amount = parseFloat(withdrawAmount);

    setIsWithdrawing(true);
    setWithdrawError('');
    setWithdrawSuccess('');

    try {
      const accessToken = secureStorage.getAccessToken();
      
      if (!accessToken) {
        throw new Error(t('commission.authRequired'));
      }

      // Use the correct withdrawal endpoint
            const response = await fetch('https://core-api.ddin.rw/v1/agency/accounts/self-serve/withdrawals/commissions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount
          // Only sending amount as specified
        }),
      });

      const data: WithdrawResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t('commission.withdrawalFailed'));
      }

      setWithdrawSuccess(data.message || t('commission.withdrawalSuccess', { amount: amount.toLocaleString() }));
      setWithdrawAmount('');
      setValidationError('');
      
      // Refresh balances after successful withdrawal
      setTimeout(() => fetchCommissionBalance(true), 1000);
      
    } catch (err: any) {
      setWithdrawError(err.message || t('commission.withdrawalError'));
    } finally {
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    fetchCommissionBalance();
  }, []);

  const handleRefresh = () => {
    fetchCommissionBalance(true);
  };

  const toggleAmountsVisibility = () => {
    setShowAmounts(!showAmounts);
  };

  const formatHiddenAmount = (formattedAmount: string) => {
    return formattedAmount.replace(/[0-9]/g, '•');
  };

  const setMaxAmount = () => {
    if (availableBalance >= MIN_WITHDRAWAL_AMOUNT) {
      handleAmountChange(availableBalance.toString());
    } else {
      setWithdrawError(t('commission.insufficientBalance', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#ff6600] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('commission.loading')}</p>
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
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{t('commission.error')}</h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              <button
                onClick={() => fetchCommissionBalance()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                {t('commission.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-4xl">
        
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white text-center sm:text-left">
            {t('commission.title')}
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
                  <span className="hidden sm:inline">{t('commission.hideAmounts')}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('commission.showAmounts')}</span>
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
                {refreshing ? t('commission.refreshing') : t('commission.refresh')}
              </span>
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Instant Commission Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={toggleAmountsVisibility}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-2 sm:p-3">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('commission.instantCommission')}</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 truncate">
                  {showAmounts 
                    ? (instantCommissionAccount ? instantCommissionAccount.formattedBalance : 'RWF 0.00')
                    : (instantCommissionAccount ? formatHiddenAmount(instantCommissionAccount.formattedBalance) : '••••••')
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t('commission.available')}: {showAmounts 
                    ? (instantCommissionAccount ? instantCommissionAccount.formattedAvailableBalance : 'RWF 0.00')
                    : (instantCommissionAccount ? formatHiddenAmount(instantCommissionAccount.formattedAvailableBalance) : '••••••')
                  }
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                  {t('commission.minWithdrawalLabel')}: RWF {MIN_WITHDRAWAL_AMOUNT.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {t('commission.clickTo')} {showAmounts ? t('commission.hide') : t('commission.show')} {t('commission.amount')} • {t('commission.readyToWithdraw')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Delayed Commission Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={toggleAmountsVisibility}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full p-2 sm:p-3">
                <Timer className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('commission.delayedCommission')}</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">
                  {showAmounts 
                    ? (delayedCommissionAccount ? delayedCommissionAccount.formattedBalance : 'RWF 0.00')
                    : (delayedCommissionAccount ? formatHiddenAmount(delayedCommissionAccount.formattedBalance) : '••••••')
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">{t('commission.pendingRelease')}</p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {t('commission.clickTo')} {showAmounts ? t('commission.hide') : t('commission.show')} {t('commission.amount')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Withdraw Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center sm:text-left">
            {t('commission.withdrawCommission')}
          </h3>

          {/* Success Message */}
          {withdrawSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm">{withdrawSuccess}</p>
            </div>
          )}

          {/* Error Message */}
          {(withdrawError || validationError) && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{withdrawError || validationError}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <input
                  type="number"
                  placeholder={t('commission.enterAmountPlaceholder', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() })}
                  value={withdrawAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6600] text-sm sm:text-base pr-20"
                  min={MIN_WITHDRAWAL_AMOUNT}
                  max={availableBalance}
                />
                <button
                  type="button"
                  onClick={setMaxAmount}
                  disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-[#13294b] text-white text-xs rounded hover:bg-[#0f213d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('commission.max')}
                </button>
              </div>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || !!validationError || isWithdrawing}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00] transition disabled:opacity-50 font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              {isWithdrawing ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {isWithdrawing ? t('commission.processing') : t('commission.withdrawNow')}
            </button>
          </div>

          {/* Available Balance Info */}
          {instantCommissionAccount && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {t('commission.availableForWithdrawal')}: <span className="font-semibold">{instantCommissionAccount.formattedAvailableBalance}</span>
                {availableBalance < MIN_WITHDRAWAL_AMOUNT && (
                  <span className="text-red-600 dark:text-red-400 ml-2">
                    ({t('commission.minimumRequired', { amount: MIN_WITHDRAWAL_AMOUNT.toLocaleString() })})
                  </span>
                )}
              </p>
            </div>
          )}
        </motion.div>

        {/* Commission Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {t('commission.withdrawalGuidelines')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-[#ff6600] mb-2">{t('commission.amountLimits')}</h4>
              <ul className="space-y-1 text-xs">
                <li>• {t('commission.minimumWithdrawal')}: <strong>RWF 5,000</strong></li>
                <li>• {t('commission.maximumWithdrawal')}: {t('commission.availableBalance')}</li>
                <li>• {t('commission.wholeNumbersOnly')}</li>
                <li>• {t('commission.multiplesOf100')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">{t('commission.processing')}</h4>
              <ul className="space-y-1 text-xs">
                <li>• {t('commission.instantCommissionOnly')}</li>
                <li>• {t('commission.processedWithin24Hours')}</li>
                <li>• {t('commission.noWithdrawalFees')}</li>
                <li>• {t('commission.requiresAdminApproval')}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
