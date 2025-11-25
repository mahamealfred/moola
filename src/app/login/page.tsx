'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Loader2, DollarSign, CreditCard, Send, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useTranslation } from '@/lib/i18n-context';
import { api } from '@/lib/api-client';
import DashboardLoading from '@/components/DashboardLoading';

export const runtime = "edge";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, redirect, router]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError(t('login.errorBothFields'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/agency/auth/login', { username, password });
      
      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Use the auth context login function
      login(result.data);
      
      // Show loading screen while redirecting to dashboard
      setIsRedirecting(true);
      
      // Small delay to show loading screen, then navigate
      setTimeout(() => {
        router.push(redirect);
      }, 500);
      
    } catch (err: any) {
      setError(err.message || t('login.errorGeneral'));
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6600] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('common.checkingAuth')}</p>
        </div>
      </div>
    );
  }

  // Show loading screen when redirecting to dashboard
  if (isRedirecting) {
    return <DashboardLoading />;
  }

  // Don't show login page if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors duration-700 relative overflow-x-hidden">
      {/* Payment & Money Transfer Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated Money Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5">
          <defs>
            <linearGradient id="moneyFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6600" />
              <stop offset="50%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#2196F3" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,100 Q250,50 500,100 T1000,100"
            stroke="url(#moneyFlow)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M0,300 Q250,250 500,300 T1000,300"
            stroke="url(#moneyFlow)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
          <motion.path
            d="M0,500 Q250,450 500,500 T1000,500"
            stroke="url(#moneyFlow)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
          />
        </svg>

        {/* Floating Payment Icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 flex items-center justify-center backdrop-blur-sm border border-green-400/30">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500/40" />
            </div>
          </motion.div>
        ))}

        {/* Card/Wallet Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`wallet-${i}`}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
            style={{
              right: `${5 + i * 15}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
          >
            <CreditCard className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500/30" />
          </motion.div>
        ))}

        {/* Transfer Arrow Paths */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 sm:w-48"
          animate={{ x: [0, 100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Send className="w-8 h-8 sm:w-12 sm:h-12 text-orange-500/30" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 sm:w-48"
          animate={{ x: [0, -100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500/30" />
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-400/10 to-blue-500/10 dark:from-green-400/5 dark:to-blue-500/5 blur-3xl rounded-full top-20 left-10 animate-pulse"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-orange-400/10 to-purple-500/10 dark:from-orange-400/5 dark:to-purple-500/5 blur-3xl rounded-full bottom-20 right-10 animate-pulse"
        />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Left: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 space-y-6"
        >
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#13294b] dark:text-white">
              <span className="text-[#ff6600]">M</span>oola<span className="text-[#ff6600] text-lg align-super">+</span>
            </h1>
          </header>

          <h2 className="text-xl font-semibold text-[#13294b] dark:text-white">{t('login.title')}</h2>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm flex-1">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('login.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
                placeholder={t('login.enterUsername')}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all"
                required
                disabled={isLoading}
                minLength={2}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  placeholder={t('login.enterPassword')}
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                  minLength={1}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword(prev => !prev)}
                  disabled={isLoading}
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="accent-[#ff6600] cursor-pointer" 
                  disabled={isLoading}
                />
                {t('login.rememberMe')}
              </label>
              <Link 
                href="/forgot-password" 
                className="text-[#ff6600] hover:underline transition-colors"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8c00] hover:from-[#e65c00] hover:to-[#e65c00] text-white font-semibold py-3 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('login.signingIn')}
                </>
              ) : (
                t('login.signIn')
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('login.becomeAgent')}{' '}
              <Link 
                href="/registration" 
                className="text-[#ff6600] font-medium hover:underline transition-colors"
              >
                {t('login.register')}
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Right: Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#13294b] via-[#0f213d] to-[#ff6600] dark:from-[#13294b] dark:to-[#ff6600] text-white px-10 py-12"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-4xl font-extrabold mb-4"
          >
            {t('login.welcomeTitle')}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-lg font-medium max-w-md"
          >
            {t('login.welcomeDescription')}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
