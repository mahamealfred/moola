'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router =useRouter()

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in...', { email, password });
     const isValid = email && password; // Replace with real validation
    if (isValid) {
      // redirect to dashboard
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-gradient-to-br from-blue-100 to-white dark:from-gray-950 dark:to-gray-900 transition-colors"
    >
      {/* Floating Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute w-72 h-72 bg-blue-400/30 dark:bg-blue-900/20 rounded-full filter blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-52 h-52 bg-purple-300/20 dark:bg-purple-800/20 rounded-full filter blur-2xl bottom-10 right-1/4 animate-ping" />
      </div>

      {/* Header with Logo and Toggle */}
      <header className="z-10 relative flex justify-between items-center px-6 py-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur border-b border-gray-200 dark:border-gray-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          {/* <Image src="/logo.png" alt="DDIN Logo" width={40} height={40} className="rounded-md" /> */}
          <span className="text-xl font-bold text-gray-800 dark:text-white">X-pay</span>
        </motion.div>

        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>
      </header>

      {/* Form */}
      <main className="relative z-10 flex items-center justify-center py-16 px-4">
        <motion.form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Sign in to your account</h2>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:text-blue-600"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Forgot Password + Remember Me */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Sign In
          </motion.button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{' '}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.form>
      </main>
    </motion.div>
  );
}
