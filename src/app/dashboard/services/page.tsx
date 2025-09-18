'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
} from 'lucide-react';

import ElectricityPayment from './payment-services/electricity/page';
import RraPayment from './payment-services/rra/page';
import BulkSmsForm from './payment-services/bulk-sms/page';
import AirtimePurchase from './payment-services/airtme/page';
import StartimesPayment from './payment-services/startime/page';
import WASACPayment from './payment-services/wasac/page';
import SchoolFeesPayment from './payment-services/schools/page';

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
  { name: 'Wasac', icon: Droplet, content: <WASACPayment/>},
  { name: 'School Fees', icon: BookOpen, content: <SchoolFeesPayment/> },
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function DashboardHome() {
  const [selectedService, setSelectedService] = useState<PaymentService | null>(null);
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 p-4 md:p-6 min-h-screen bg-white dark:bg-gray-950 transition-colors"
    >
      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {selectedService.icon && React.createElement(selectedService.icon, { className: "w-5 h-5" })}
                  {selectedService.name}
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 md:p-5">
                <div className="text-gray-800 dark:text-gray-100">
                  {typeof selectedService.content === 'string'
                    ? <div className="text-center py-6 md:py-8 text-sm md:text-base">{selectedService.content}</div>
                    : React.cloneElement(selectedService.content as React.ReactElement, {
                        className: "w-full h-full"
                      })
                  }
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Payment Services */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-5 text-center text-[#13294b] dark:text-white">
            Payment Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {paymentServices.map(({ name, icon: Icon, content }) => (
              <motion.div
                key={name}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl md:rounded-2xl p-4 cursor-pointer transition-all duration-300 group"
                onClick={() => setSelectedService({ name, icon: Icon, content })}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="p-2 md:p-3 bg-[#ff6600]/20 dark:bg-[#ff6600]/30 text-[#ff6600] rounded-full transition-transform duration-300 group-hover:rotate-6">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors">
                    {name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Agency Banking */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-5 text-center text-[#13294b] dark:text-white">
            Agency Banking
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {agencyBankingServices.map(({ name, icon: Icon, href }) => (
              <motion.div
                key={name}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl md:rounded-2xl p-4 cursor-pointer transition-all duration-300 group"
                onClick={() => router.push(href)}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="p-2 md:p-3 bg-[#ff6600]/20 dark:bg-[#ff6600]/30 text-[#ff6600] rounded-full transition-transform duration-300 group-hover:rotate-6">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors">
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