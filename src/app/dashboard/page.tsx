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
import { useAuth } from '@/lib/auth-context';


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
  const { user } = useAuth();

  // Determine user role
  const userRole = user?.category;
  const isAgent = userRole === "Agent";
  const isCorporate = userRole === "Corporate" || userRole === "Business";

  const allServices = [
    { 
      name: t('dashboardHome.balance'), 
      href: '/dashboard/balance', 
      icon: DollarSign,
      description: t('dashboardHome.balanceDesc'),
      gradient: 'from-[#ff6600] to-[#ff8c00]'
    },
    { 
      name: t('dashboardHome.services'), 
      href: '/dashboard/services', 
      icon: Zap,
      description: t('dashboardHome.servicesDesc'),
      gradient: 'from-[#ff6600] to-[#ff8533]'
    },
    { 
      name: t('dashboardHome.transactions'), 
      href: '/dashboard/transactions', 
      icon: CreditCard,
      description: t('dashboardHome.transactionsDesc'),
      gradient: 'from-[#13294b] to-[#1a3a5f]'
    },
    { 
      name: t('dashboardHome.settings'), 
      href: '/dashboard/settings', 
      icon: Settings,
      description: t('dashboardHome.settingsDesc'),
      gradient: 'from-[#ff6600] to-[#ff8c00]'
    },
  ];

  // Filter services based on user role
  const services = allServices;

  return (
    <div className="relative bg-transparent transition-colors px-4 sm:px-6 py-6 sm:py-8 w-full">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4 sm:mb-6 w-full"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#ff6600] to-[#ff8c00] bg-clip-text text-transparent">{t('dashboardHome.welcomeTo')} </span>
          <span className="bg-gradient-to-r from-[#ff6600] to-[#ff8c00] bg-clip-text text-transparent relative">
            M<span className="text-[#ff6600]">oola</span>
            <span className="text-[#ff6600] absolute text-lg sm:text-xl lg:text-2xl" style={{ top: '-0.3em', marginLeft: '0.1em' }}>+</span>
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 font-normal">
          {t('dashboardHome.subtitle')}
        </p>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl mx-auto justify-items-center"
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
    </div>
  );
}
