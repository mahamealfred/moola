'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sun, Moon, Eye, EyeOff, AlertCircle, Loader2, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

export const runtime = "edge";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, redirect, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextTheme);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/v1/agency/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Use the auth context login function
      login(result.data);
      
      // The AuthProvider will handle the redirect automatically
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
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
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
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
      {/* Floating blurred background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#13294b]/20 dark:bg-[#13294b]/30 blur-3xl rounded-full top-10 left-1/4 animate-pulse" />
        <div className="absolute w-64 h-64 bg-[#ff6600]/20 dark:bg-[#ff6600]/30 blur-2xl rounded-full bottom-10 right-1/4 animate-ping" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Security Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-xs">
          <Shield className="w-3 h-3" />
          Secure
        </div>

        {/* Left: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 space-y-6"
        >
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#13294b] dark:text-white">
              <span className="text-[#ff6600]">X</span>-Pay
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
          </header>

          <h2 className="text-xl font-semibold text-[#13294b] dark:text-white">Sign in to your account</h2>

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
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all"
                required
                disabled={isLoading}
                minLength={2}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
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
                  placeholder="Enter your password"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                Remember me
              </label>
              <Link 
                href="/forgot-password" 
                className="text-[#13294b] dark:text-[#ff6600] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#13294b] dark:bg-[#ff6600] hover:bg-[#0f213d] dark:hover:bg-[#e65c00] text-white font-semibold py-3 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Do you want to become an Agent?{' '}
              <Link 
                href="/registration" 
                className="text-[#13294b] dark:text-[#ff6600] font-medium hover:underline transition-colors"
              >
                Register
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
            Welcome to X-pay
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-lg font-medium max-w-md"
          >
            A network of the best – empowering agents and individuals to access and offer essential financial services easily and securely.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}