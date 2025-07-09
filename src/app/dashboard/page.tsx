'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MonitorCheck,
  CreditCard,
  DollarSign,
  Settings,
  Zap,
  Phone,
  FileText,
} from 'lucide-react';

const services = [
  { name: 'Check Balance', href: '/dashboard/balance', icon: DollarSign },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Commissions', href: '/dashboard/commissions', icon: MonitorCheck },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Services', href: '/dashboard/services', icon: Zap },

];

export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Available Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map(({ name, href, icon: Icon }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.03, boxShadow: '0px 6px 20px rgba(59, 130, 246, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-6 transition-all duration-300 ease-in-out"
          >
            <Link href={href} className="flex flex-col items-start gap-4 group">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full group-hover:rotate-6 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-lg font-semibold text-gray-800 dark:text-white group-hover:underline">
                {name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
