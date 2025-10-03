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
  Users,
  CreditCard,
  FileSpreadsheet,
  Calculator,
  X,
} from 'lucide-react';

import ElectricityPayment from './payment-services/electricity/page';
import RraPayment from './payment-services/rra/page';
import BulkSmsForm from './payment-services/bulk-sms/page';
import AirtimePurchase from './payment-services/airtme/page';
import StartimesPayment from './payment-services/startime/page';
import WASACPayment from './payment-services/wasac/page';
import SchoolFeesPayment from './payment-services/schools/page';
import BulkSalaryPayment from './business-services/bulk-salary/page';
import InvoicePayment from './business-services/invoice-payment/page';
import TaxCalculation from './business-services/tax-calculation/page';
import ExpenseManagement from './business-services/expense-management/page';
import IremboPayment from './payment-services/irembopay/page';
import RNITPayment from './payment-services/rnit/page';
import BulkAirtimeForm from './payment-services/bulk-airtime/page';

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

type BusinessService = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
};

type UserRole = 'agent' | 'business';

// Mock function to get user role - replace with your actual auth logic
const getUserRole = (): UserRole => {
  const role = localStorage.getItem('userRole') as UserRole;
  return role || 'agent';
};

const paymentServices: PaymentService[] = [
  { name: 'Electricity Payment', icon: Zap, content: <ElectricityPayment /> },
  { name: 'RRA Payment', icon: FileText, content: <RraPayment /> },
  { name: 'Buy Airtime', icon: Phone, content: <AirtimePurchase /> },
  { name: 'Startimes Payment', icon: Tv, content: <StartimesPayment /> },
  { name: 'Bulk SMS', icon: MessageSquare, content: <BulkSmsForm /> },
  { name: 'Bulk Airtime', icon: MessageSquare, content: <BulkAirtimeForm /> },
  { name: 'Wasac', icon: Droplet, content: <WASACPayment/>},
  { name: 'Irembo Pay', icon: Droplet, content: <IremboPayment/>},
  { name: 'RNIT', icon: Droplet, content: <RNITPayment/>},
  { name: 'School Fees', icon: BookOpen, content: <SchoolFeesPayment/> },
];

const agencyBankingServices: AgencyBankingService[] = [
  { name: 'Ecobank', icon: Banknote, href: '/dashboard/services/agency-banking/ecobank' },
  { name: 'Bank of Kigali', icon: Building2, href: '/dashboard/balance' },
  { name: 'Equity Bank', icon: Landmark, href: '/dashboard/balance' },
  { name: 'GT Bank', icon: ShieldCheck, href: '/dashboard/balance' },
];

const businessServices: BusinessService[] = [
  { name: 'Bulk Salary Payment', icon: Users, content: <BulkSalaryPayment /> },
  { name: 'Invoice Payments', icon: CreditCard, content: <InvoicePayment /> },
  { name: 'Tax Calculation', icon: Calculator, content: <TaxCalculation /> },
  { name: 'Expense Management', icon: FileSpreadsheet, content: <ExpenseManagement /> },
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
  const [selectedService, setSelectedService] = useState<PaymentService | BusinessService | null>(null);
  const router = useRouter();
  const userRole = getUserRole();

  const isAgent = userRole === 'agent';
  const isBusiness = userRole === 'business';

  // Color scheme from BalancePage component
  const colorScheme = {
    primary: {
      bg: 'bg-[#ff6600]',
      hover: 'hover:bg-[#e65c00]',
      text: 'text-[#ff6600]',
      border: 'border-[#ff6600]',
      light: {
        bg: 'bg-[#ff660020] dark:bg-[#ff660030]',
        text: 'text-[#ff6600]'
      }
    },
    dark: {
      bg: 'bg-[#13294b]',
      text: 'text-[#13294b]',
      border: 'border-[#13294b]'
    },
    card: {
      bg: 'bg-white dark:bg-gray-900',
      border: 'border-gray-200 dark:border-gray-700',
      hover: 'hover:shadow-2xl'
    }
  };

  const renderServiceCard = (
    service: { name: string; icon: React.ElementType; content?: any; href?: string },
    sectionType: 'payment' | 'agency' | 'business' = 'payment'
  ) => {
    const getCardColors = () => {
      switch (sectionType) {
        case 'agency':
          return {
            bg: colorScheme.card.bg,
            border: colorScheme.card.border,
            iconBg: colorScheme.primary.light.bg,
            iconColor: colorScheme.primary.text,
            hover: colorScheme.card.hover
          };
        case 'business':
          return {
            bg: colorScheme.card.bg,
            border: colorScheme.card.border,
            iconBg: colorScheme.primary.light.bg,
            iconColor: colorScheme.primary.text,
            hover: colorScheme.card.hover
          };
        default: // payment
          return {
            bg: colorScheme.card.bg,
            border: colorScheme.card.border,
            iconBg: colorScheme.primary.light.bg,
            iconColor: colorScheme.primary.text,
            hover: colorScheme.card.hover
          };
      }
    };

    const colors = getCardColors();

    return (
      <motion.div
        key={service.name}
        variants={cardVariants}
        whileHover={{ 
          scale: 1.02,
          y: -2
        }}
        whileTap={{ scale: 0.98 }}
        className={`${colors.bg} ${colors.border} rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 group border ${colors.hover}`}
        onClick={() => {
          if (service.href) {
            router.push(service.href);
          } else {
            setSelectedService(service as PaymentService | BusinessService);
          }
        }}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${colors.iconBg} ${colors.iconColor}`}>
            <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#ff6600] transition-colors text-base sm:text-lg truncate">
              {service.name} 
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
              {sectionType === 'payment' && 'Quick payment service'}
              {sectionType === 'agency' && 'Banking services'}
              {sectionType === 'business' && 'Business solutions'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

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
          Welcome to Your Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-gray-500 dark:text-gray-400 mt-2 text-lg sm:text-xl"
        >
          {isAgent ? 'Agency Services Portal' : 'Business Services Portal'}
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
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Payment Services - Show for both Agent and Business */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
              Payment Services
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paymentServices.map((service) => renderServiceCard(service, 'payment'))}
          </div>
        </motion.section>

        {/* Agency Banking - Show only for Agents */}
        {isAgent && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
                Agency Banking
              </h2>
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {agencyBankingServices.map((service) => renderServiceCard(service, 'agency'))}
            </div>
          </motion.section>
        )}

        {/* Business Services - Show only for Business users */}
        {isBusiness && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
                Business Services
              </h2>
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {businessServices.map((service) => renderServiceCard(service, 'business'))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
            {paymentServices.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Payment Services</div>
        </div>
        
        {isAgent && (
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
              {agencyBankingServices.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Bank Partners</div>
          </div>
        )}
        
        {isBusiness && (
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
              {businessServices.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Business Tools</div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#ff6600]">
            24/7
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Available</div>
        </div>
      </motion.div>

      {/* Role Display for Demo Purposes */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
        className="fixed bottom-4 right-4 bg-[#13294b] text-white px-4 py-2 rounded-full text-sm shadow-lg border border-white/10"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAgent ? 'bg-blue-400' : 'bg-green-400'}`}></div>
          <span>Role: {userRole}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}