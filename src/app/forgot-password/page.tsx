'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
export const runtime="edge";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending reset link to:', email);
    // Integrate with API to send reset link
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors"
    >
      {/* Background Floating Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute w-72 h-72 bg-blue-400/30 dark:bg-blue-900/20 rounded-full filter blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-52 h-52 bg-purple-300/20 dark:bg-purple-800/20 rounded-full filter blur-2xl bottom-10 right-1/4 animate-ping" />
      </div>

     
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center py-16 px-4">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Forgot your password?
          </h2>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <div className="space-y-5">
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
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Send Reset Link
          </motion.button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Remembered your password?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Back to Sign In
            </Link>
          </p>
        </motion.form>
      </main>
    </motion.div>
  );
}
