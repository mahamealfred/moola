'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
export const runtime = "edge";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending reset link to:', email);
    // Integrate with API to send reset link
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white dark:bg-gray-950 transition-colors overflow-hidden">
      {/* Animated Gradient Orb Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
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
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#ff6600] to-[#ff8c00] blur-3xl opacity-20"
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
          className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#13294b] to-[#1e3a5f] blur-3xl opacity-15"
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

      {/* Card container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 space-y-6"
        >
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#13294b] dark:text-white text-center">
              <span className="text-[#ff6600]">M</span>oola<span className="text-[#ff6600] text-lg align-super">+</span>
            </h1>
          </header>

          <h2 className="text-xl font-semibold text-[#13294b] dark:text-white text-center">Forgot your password?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#ff6600]"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8c00] hover:from-[#e65c00] hover:to-[#e65c00] text-white font-semibold py-3 rounded-2xl transition shadow-lg hover:shadow-xl"
            >
              Send Reset Link
            </motion.button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Remembered your password?{' '}
              <Link href="/login" className="text-[#ff6600] font-medium hover:underline">
                Back to Sign In
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Right: Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            scale: 1.01,
            transition: { repeat: Infinity, repeatType: 'reverse', duration: 1.5, ease: 'easeInOut' },
          }}
          className="hidden md:flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#13294b] via-[#0f213d] to-[#ff6600] dark:from-[#13294b] dark:to-[#ff6600] text-white px-10 py-12"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-4xl font-extrabold mb-4"
          >
            Reset Your Password
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-lg font-medium max-w-md"
          >
            Enter your email and get back access to your M-oola account securely and quickly.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
