'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MonitorCheck,
  CreditCard,
  DollarSign,
  Settings,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      // use numeric easing (cubic-bezier) to satisfy framer-motion's TypeScript types
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function DashboardHome() {
  const { t } = useTranslation();

  const services = [
    { 
      name: t('dashboardHome.balance'), 
      href: '/dashboard/balance', 
      icon: DollarSign,
      description: t('dashboardHome.balanceDesc'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: t('dashboardHome.commissions'), 
      href: '/dashboard/commission', 
      icon: MonitorCheck,
      description: t('dashboardHome.commissionsDesc'),
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      name: t('dashboardHome.services'), 
      href: '/dashboard/services', 
      icon: Zap,
      description: t('dashboardHome.servicesDesc'),
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      name: t('dashboardHome.transactions'), 
      href: '/dashboard/transactions', 
      icon: CreditCard,
      description: t('dashboardHome.transactionsDesc'),
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      name: t('dashboardHome.settings'), 
      href: '/dashboard/settings', 
      icon: Settings,
      description: t('dashboardHome.settingsDesc'),
      gradient: 'from-gray-600 to-gray-800'
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors px-4 sm:px-6 py-6 sm:py-8 w-full">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12 w-full"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#13294b] to-[#13294b] dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
          {t('dashboardHome.title')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          {t('dashboardHome.subtitle')}
        </p>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 w-full max-w-full"
      >
        {services.map(({ name, href, icon: Icon, description, gradient }) => (
          <motion.div
            key={name}
            variants={itemVariants as any}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Link href={href} className="w-full block">
              <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 cursor-pointer h-full flex flex-col w-full">
                
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                
                {/* Icon Container */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#ff6600]/10 dark:bg-[#ff6600]/20 text-[#ff6600] mb-4 group-hover:scale-110 transform transition-transform duration-300">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors duration-300 mb-2">
                    {name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {description}
                  </p>
                  
                  {/* CTA Arrow */}
                  <div className="flex items-center text-[#ff6600] opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    <span className="text-xs sm:text-sm font-medium mr-2">{t('dashboardHome.explore')}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>

                {/* Subtle Border Glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#ff6600]/10 transition-all duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm w-full">
          <div className="text-xl sm:text-2xl font-bold text-[#ff6600]">5</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboardHome.servicesCount')}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm w-full">
          <div className="text-xl sm:text-2xl font-bold text-[#ff6600]">24/7</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboardHome.available')}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm w-full">
          <div className="text-xl sm:text-2xl font-bold text-[#ff6600]">{t('dashboardHome.secure')}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboardHome.protected')}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm w-full">
          <div className="text-xl sm:text-2xl font-bold text-[#ff6600]">{t('dashboardHome.fast')}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboardHome.processing')}</div>
        </div>
      </motion.div>

      {/* Background Decorative Elements - Fixed positioning */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-[#ff6600]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#13294b]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
}
