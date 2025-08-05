'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
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
  UserPlus,
  Download,
  Upload,
  SendHorizonal,
  KeyRound,
} from 'lucide-react';

import ElectricityPayment from '../../payment-services/electricity/page';
import DepositForm from "./deposit/page";
import OpenAccount from './account-openning/page';
import RemittanceForm from './remittance/page';

// Types
type PaymentService = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
};
type EcobankServices = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
};


const ecobankServices:  EcobankServices[] = [
  { name: 'Open Account', icon: UserPlus, content: <OpenAccount />},
  { name: 'Deposit', icon: Download, content: <DepositForm />},
  { name: 'Withdrawal', icon: Upload,content: <ElectricityPayment /> },
  { name: 'Remittance', icon: SendHorizonal, content: <RemittanceForm/> },
  { name: 'Express Cash Token', icon: KeyRound, content: <ElectricityPayment />},
  { name: 'Interbank', icon: Landmark, content: <ElectricityPayment /> },
];

// Animation
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
  const [selectedService, setSelectedService] = useState<PaymentService | null>(null);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 p-6"
    >
      {/* Dialog */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedService.name}
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-800 dark:text-gray-100">
              {typeof selectedService.content === 'string' ? (
                <p>{selectedService.content}</p>
              ) : (
                selectedService.content
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ecobank Services */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Ecobank Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ecobankServices.map(({ name, icon: Icon, content }) => (
            <motion.div
              key={name}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-4 transition-all duration-300 ease-in-out"
              onClick={() => setSelectedService({ name, icon: Icon, content })}
              // className="transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full group-hover:rotate-6 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-base font-medium text-gray-800 dark:text-white group-hover:underline">
                  {name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
