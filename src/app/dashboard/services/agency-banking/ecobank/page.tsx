'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Download,
  Upload,
  SendHorizonal,
  KeyRound,
  Landmark,
  X,
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function DashboardHome() {
  const [selectedService, setSelectedService] = useState<EcobankServices | null>(null);

  const renderServiceCard = (service: EcobankServices) => (
    <motion.div
      key={service.name}
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedService(service)}
    >
      <div className="flex items-center gap-4">
        <div className="bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] rounded-full p-3 transition-all duration-300 group-hover:scale-110">
          <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#ff6600] transition-colors text-base sm:text-lg truncate">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
            Ecobank banking service
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#13294b] dark:text-white"
        >
          Ecobank Services
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-gray-500 dark:text-gray-400 mt-2 text-lg sm:text-xl"
        >
          Complete banking solutions at your fingertips
        </motion.p>
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  {selectedService.icon && React.createElement(selectedService.icon, { 
                    className: "w-5 h-5 sm:w-6 sm:h-6 text-[#ff6600]" 
                  })}
                  <span className="truncate">{selectedService.name}</span>
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6">
                <div className="text-gray-800 dark:text-gray-100">
                  {typeof selectedService.content === 'string'
                    ? <div className="text-center py-6 sm:py-8 text-base sm:text-lg">{selectedService.content}</div>
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

      {/* Services Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
            Available Services
          </h2>
          <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ecobankServices.map((service) => renderServiceCard(service))}
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
            {ecobankServices.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total Services</div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
            24/7
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Available</div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
            Instant
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Processing</div>
        </div>
      </motion.div>
    </motion.div>
  );
}