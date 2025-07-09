'use client';
export const runtime="edge";
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
  Tv,
  MessageSquare,
  Globe,
  Building2,
  Landmark,
  Banknote,
  ShieldCheck,
} from 'lucide-react';

const paymentServices = [
  { name: 'Electricity Payment', href: '/services/electricity', icon: Zap },
  { name: 'RRA Payment', href: '/services/rra', icon: FileText },
  { name: 'Buy Airtime', href: '/services/airtime', icon: Phone },
  { name: 'Startimes Payment', href: '/services/startimes', icon: Tv },
  { name: 'Bulk SMS', href: '/services/sms', icon: MessageSquare },
  { name: 'Irembo Pay', href: '/services/irembo', icon: Globe },
];

const agencyBankingServices = [
  { name: 'Ecobank', href: '/agency/ecobank', icon: Banknote },
  { name: 'Bank of Kigali', href: '/agency/bk', icon: Building2 },
  { name: 'Equity Bank', href: '/agency/equity', icon: Landmark },
  { name: 'GT Bank', href: '/agency/gtbank', icon: ShieldCheck },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardHome() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* Payment Services */}
      <section>
      <h2 className="text-2xl font-bold mb-4 mt-10 text-gray-900 dark:text-white text-center">
          Payment Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paymentServices.map(({ name, href, icon: Icon }) => (
           <motion.div
  key={name}
  variants={cardVariants}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-4 transition-all duration-300 ease-in-out"
>
  <Link href={href} className="flex flex-col items-start gap-3 group">
    <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full group-hover:rotate-6 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-base font-medium text-gray-800 dark:text-white group-hover:underline">
      {name}
    </span>
  </Link>
</motion.div>

          ))}
        </div>
      </section>

      {/* Agency Banking */}
      <section>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
  Agency Banking
</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {agencyBankingServices.map(({ name, href, icon: Icon }) => (
           <motion.div
  key={name}
  variants={cardVariants}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-4 transition-all duration-300 ease-in-out"
>
  <Link href={href} className="flex flex-col items-start gap-3 group">
    <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full group-hover:rotate-6 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-base font-medium text-gray-800 dark:text-white group-hover:underline">
      {name}
    </span>
  </Link>
</motion.div>

          ))}
        </div>
      </section>
    </motion.div>
  );
}
