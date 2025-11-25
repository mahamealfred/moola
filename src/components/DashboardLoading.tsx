'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function DashboardLoading() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors relative overflow-hidden">
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

      {/* Loading Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-black text-3xl tracking-tighter drop-shadow relative">
                M
                <span className="absolute text-lg font-black" style={{ top: '-0.3em', marginLeft: '0.1em' }}>+</span>
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-2xl blur-xl opacity-50 -z-10" />
          </div>
        </motion.div>

        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Loader2 className="w-12 h-12 text-[#ff6600] mx-auto" />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#13294b] dark:text-white mb-2">
            {t('common.loadingDashboard') || 'Loading Dashboard...'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('common.loading') || 'Please wait...'}
          </p>
        </motion.div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full bg-[#ff6600]"
            />
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-xs mx-auto"
        >
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full bg-gradient-to-r from-[#ff6600] to-[#ff8c00] rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
