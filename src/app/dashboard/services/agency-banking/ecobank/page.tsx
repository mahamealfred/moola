'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Download,
  Upload,
  SendHorizonal,
  KeyRound,
  Landmark,
} from 'lucide-react';

import OpenAccount from './account-openning/page';
import DepositForm from './deposit/page';
import ElectricityPayment from '../../payment-services/electricity/page';
import RemittanceForm from './remittance/page';
import Withdrawal from './withdral/page';
import ExpressCashToken from './expressCashToken/page';

type EcobankServices = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
};

const ecobankServices: EcobankServices[] = [
  { name: 'Open Account', icon: UserPlus, content: <OpenAccount /> },
  { name: 'Deposit', icon: Download, content: <DepositForm /> },
  { name: 'Withdrawal', icon: Upload, content: <Withdrawal/> },
  { name: 'Remittance', icon: SendHorizonal, content: <RemittanceForm /> },
  { name: 'Express Cash Token', icon: KeyRound, content: <ExpressCashToken /> },
  { name: 'Interbank', icon: Landmark, content: <ElectricityPayment /> },
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
  const [selectedService, setSelectedService] = useState<EcobankServices | null>(null);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 p-6"
    >
      {/* Dialog */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
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
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Ecobank Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ecobankServices.map(({ name, icon: Icon, content }) => (
            <motion.div
              key={name}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-5 cursor-pointer transition-all duration-300 backdrop-blur-sm"
              onClick={() => setSelectedService({ name, icon: Icon, content })}
            >
              <div className="flex flex-col items-start gap-3 group">
                <div className="p-3 bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] rounded-full group-hover:rotate-6 transition-transform duration-300">
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
    </motion.div>
  );
}
