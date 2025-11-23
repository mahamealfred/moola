'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useTranslation } from '@/lib/i18n-context';
import { api } from '@/lib/api-client';

export const runtime = "edge";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // The AuthProvider will handle the redirect automatically
      
    } catch (err: any) {
      setError(err.message || t('login.errorGeneral'));
    } finally {
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

  // Don't show login page if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors relative overflow-hidden">
      {/* Animated Gradient Orb Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.1, 1],
            x: [-20, 20, -20],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#ff6600] to-[#ff8c00] blur-3xl opacity-20"
        />
        
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.15, 1],
            x: [20, -20, 20],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#13294b] to-[#1e3a5f] blur-3xl opacity-15"
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255, 102, 0) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
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
