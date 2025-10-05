'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle
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
import { useAuth } from '@/lib/auth-context';

type PaymentService = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
  category: string;
  popularity: number;
  isNew?: boolean;
  isFeatured?: boolean;
};

type AgencyBankingService = {
  name: string;
  icon: React.ElementType;
  href: string;
  status: 'active' | 'coming-soon';
};

type BusinessService = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
  category: string;
};

type UserRole = 'Agent' | 'Corporate';

const paymentServices: PaymentService[] = [
  { name: 'Electricity Payment', icon: Zap, content: <ElectricityPayment />, category: 'Utilities', popularity: 95, isFeatured: true },
  { name: 'RRA Payment', icon: FileText, content: <RraPayment />, category: 'Government', popularity: 88 },
  { name: 'Buy Airtime', icon: Phone, content: <AirtimePurchase />, category: 'Telecom', popularity: 92, isFeatured: true },
  { name: 'Startimes Payment', icon: Tv, content: <StartimesPayment />, category: 'Entertainment', popularity: 78 },
  { name: 'Bulk SMS', icon: MessageSquare, content: <BulkSmsForm />, category: 'Communication', popularity: 82 },
  { name: 'Bulk Airtime', icon: MessageSquare, content: <BulkAirtimeForm />, category: 'Telecom', popularity: 85, isNew: true },
  { name: 'Wasac', icon: Droplet, content: <WASACPayment/>, category: 'Utilities', popularity: 75 },
  { name: 'Irembo Pay', icon: Shield, content: <IremboPayment/>, category: 'Government', popularity: 80 },
  { name: 'RNIT', icon: Building2, content: <RNITPayment/>, category: 'Government', popularity: 72 },
  { name: 'School Fees', icon: BookOpen, content: <SchoolFeesPayment/>, category: 'Education', popularity: 79, isNew: true },
];

const agencyBankingServices: AgencyBankingService[] = [
  { name: 'Ecobank', icon: Banknote, href: '/dashboard/services/agency-banking/ecobank', status: 'active' },
  { name: 'Bank of Kigali', icon: Building2, href: '/dashboard/balance', status: 'active' },
  { name: 'Equity Bank', icon: Landmark, href: '/dashboard/balance', status: 'active' },
  { name: 'GT Bank', icon: ShieldCheck, href: '/dashboard/balance', status: 'coming-soon' },
];

const businessServices: BusinessService[] = [
  { name: 'Bulk Salary Payment', icon: Users, content: <BulkSalaryPayment />, category: 'Payroll' },
  { name: 'Invoice Payments', icon: CreditCard, content: <InvoicePayment />, category: 'Finance' },
  { name: 'Tax Calculation', icon: Calculator, content: <TaxCalculation />, category: 'Finance' },
  { name: 'Expense Management', icon: FileSpreadsheet, content: <ExpenseManagement />, category: 'Operations' },
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function DashboardHome() {
  const [selectedService, setSelectedService] = useState<PaymentService | BusinessService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'new'>('popularity');
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.category;
  

  const isAgent = userRole === user?.category;
  const isBusiness = userRole === user?.category;

  // Get unique categories for filtering
  const categories = ['All', ...new Set(paymentServices.map(service => service.category))];

  // Filter and sort payment services
  const filteredPaymentServices = useMemo(() => {
    let filtered = paymentServices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    // Sort services
    switch (sortBy) {
      case 'popularity':
        filtered = filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'new':
        filtered = filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [searchTerm, activeCategory, sortBy]);

  // Original color scheme from your code
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

  type Service = PaymentService | AgencyBankingService | BusinessService;

  const renderServiceCard = (
    service: Service & { isNew?: boolean; isFeatured?: boolean; status?: string; href?: string },
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
        className={`${colors.bg} ${colors.border} rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 group border relative ${colors.hover} ${
          service.status === 'coming-soon' ? 'opacity-60' : ''
        }`}
        onClick={() => {
          if (service.status === 'coming-soon') return;
          if (service.href) {
            router.push(service.href);
          } else {
            setSelectedService(service as PaymentService | BusinessService);
          }
        }}
      >
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {service.isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {service.isFeatured && (
            <span className="bg-[#ff6600] text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {service.status === 'coming-soon' && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
              Coming Soon
            </span>
          )}
        </div>

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
          <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-[#ff6600] transition-colors flex-shrink-0 ${
            service.status === 'coming-soon' ? 'opacity-50' : ''
          }`} />
        </div>

        {/* Popularity indicator for payment services */}
        {sectionType === 'payment' && 'popularity' in service && (
          (() => {
            const popularity = (service as PaymentService).popularity;
            return (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-[#ff6600] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${popularity}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {popularity}%
                </span>
              </div>
            );
          })()
        )}
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
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-gray-200 dark:border-gray-600">
          <Sparkles className="w-4 h-4 text-[#ff6600]" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Welcome back, {user?.name || 'User'}
          </span>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          {isAgent ? 'Comprehensive Agency Services Platform' : 'Advanced Business Services Platform'}
        </p>
      </motion.div>

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
                  {typeof selectedService.content === 'string' ? (
                    <div className="text-center py-6 sm:py-8 text-base sm:text-lg">{selectedService.content}</div>
                  ) : (
                    <div className="w-full h-full">{selectedService.content}</div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Stats Section */}
      <motion.div 
        variants={statsVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#ff660020] dark:bg-[#ff660030]">
              <TrendingUp className="w-6 h-6 text-[#ff6600]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {paymentServices.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Services</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {paymentServices.filter(s => s.isFeatured).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Featured</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/20">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                24/7
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/20">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                100%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Secure</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Payment Services with Advanced Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
                Payment Services
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Quick and secure payment solutions for all your needs
              </p>
            </div>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full lg:hidden"></div>
          </div>

          {/* Advanced Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Box */}
              <div className="flex-1 w-full sm:max-w-xs">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-[#ff6600] text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition-all"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="name">Alphabetical</option>
                  <option value="new">New First</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || activeCategory !== 'All') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {activeCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full">
                    Category: {activeCategory}
                    <button onClick={() => setActiveCategory('All')} className="hover:text-green-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredPaymentServices.map((service) => renderServiceCard(service, 'payment'))}
          </motion.div>

          {/* No Results State */}
          {filteredPaymentServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 dark:text-gray-500 text-lg">
                No services found matching your criteria
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="mt-4 text-[#ff6600] hover:text-[#e65c00] font-medium"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </motion.section>

        {/* Agency Banking - Show only for Agents */}
        {isAgent && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
                  Agency Banking
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Partner banking services and financial solutions
                </p>
              </div>
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
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
                  Business Services
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Advanced tools for business management and operations
                </p>
              </div>
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {businessServices.map((service) => renderServiceCard(service, 'business'))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Enhanced Role Display */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isAgent ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></div>
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {userRole} Mode
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isAgent ? 'Agency Services' : 'Business Tools'}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}