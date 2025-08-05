'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MonitorCheck,
  CreditCard,
  DollarSign,
  Settings,
  Zap,
} from 'lucide-react';

const services = [
  { name: 'Balance', href: '/dashboard/balance', icon: DollarSign },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Commissions', href: '/dashboard/commission', icon: MonitorCheck },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Services', href: '/dashboard/services', icon: Zap },
];

export default function DashboardHome() {
  return (
    <div className="relative z-90">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
        Available Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(({ name, href, icon: Icon }) => (
          <motion.div
            key={name}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Link href={href}>
              <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer h-full flex flex-col justify-between">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4 group-hover:rotate-6 transform transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Access your {name.toLowerCase()} quickly and securely.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
