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
    <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors px-6 py-12">
    
      

      <h2 className="text-3xl font-extrabold mb-8 text-[#13294b] dark:text-white text-center">
        Available Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map(({ name, href, icon: Icon }) => (
          <motion.div
            key={name}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Link href={href}>
              <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer h-full flex flex-col justify-between">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#ff6600]/20 dark:bg-[#ff6600]/30 text-[#ff6600] mb-4 group-hover:rotate-6 transform transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors">
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
