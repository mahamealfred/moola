'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Phone,
  FileText,
  Tv,
  MessageSquare,
  Droplet,
  BookOpen,
  Banknote,
  Building2,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

import ElectricityPayment from './payment-services/electricity/page';
import RraPayment from './payment-services/rra/page';
import BulkSmsForm from './payment-services/bulk-sms/page';
import AirtimePurchase from './payment-services/airtme/page';
import StartimesPayment from './payment-services/startime/page';

type PaymentService = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
};

type AgencyBankingService = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const paymentServices: PaymentService[] = [
  { name: 'Electricity Payment', icon: Zap, content: <ElectricityPayment /> },
  { name: 'RRA Payment', icon: FileText, content: <RraPayment /> },
  { name: 'Buy Airtime', icon: Phone, content: <AirtimePurchase /> },
  { name: 'Startimes Payment', icon: Tv, content: <StartimesPayment /> },
  { name: 'Bulk SMS', icon: MessageSquare, content: <BulkSmsForm /> },
  { name: 'Wasac', icon: Droplet, content: 'Service not available. Contact Technical Team' },
  { name: 'School Fees', icon: BookOpen, content: 'Service not available. Contact Technical Team' },
];

const agencyBankingServices: AgencyBankingService[] = [
  { name: 'Ecobank', icon: Banknote, href: '/dashboard/services/agency-banking/ecobank' },
  { name: 'Bank of Kigali', icon: Building2, href: '/dashboard/balance' },
  { name: 'Equity Bank', icon: Landmark, href: '/dashboard/balance' },
  { name: 'GT Bank', icon: ShieldCheck, href: '/dashboard/balance' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardHome() {
  const [selectedService, setSelectedService] = useState<PaymentService | null>(null);
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 p-6 min-h-screen bg-white dark:bg-gray-950 transition-colors"
    >
      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedService.name}
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-800 dark:text-gray-100">
              {typeof selectedService.content === 'string'
                ? selectedService.content
                : selectedService.content}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Payment Services */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#13294b] dark:text-white">
            Payment Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {paymentServices.map(({ name, icon: Icon, content }) => (
              <motion.div
                key={name}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-5 cursor-pointer transition-all duration-300"
                onClick={() => setSelectedService({ name, icon: Icon, content })}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="p-3 bg-[#ff6600]/20 dark:bg-[#ff6600]/30 text-[#ff6600] rounded-full transition-transform duration-300 group-hover:rotate-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-medium text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors">
                    {name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Agency Banking */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#13294b] dark:text-white">
            Agency Banking
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {agencyBankingServices.map(({ name, icon: Icon, href }) => (
              <motion.div
                key={name}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-5 cursor-pointer transition-all duration-300"
                onClick={() => router.push(href)}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="p-3 bg-[#ff6600]/20 dark:bg-[#ff6600]/30 text-[#ff6600] rounded-full transition-transform duration-300 group-hover:rotate-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-medium text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors">
                    {name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
