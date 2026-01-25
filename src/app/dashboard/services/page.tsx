'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  CheckCircle,
  Star,
  Crown,
  Rocket,
  Target
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
import AQSFormsComponent from '@/app/dashboard/aqs-forms/page';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/lib/i18n-context';

type PaymentService = {
  name: string;
  icon: React.ElementType;
  logo?: string;
  content?: string | React.ReactElement;
  href?: string;
  externalUrl?: string;
  category: string;
  popularity: number;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  status?: 'active' | 'inactive';
};

type AgencyBankingService = {
  name: string;
  icon: React.ElementType;
  logo?: string;
  href: string;
  externalUrl?: string;
  status: 'active' | 'inactive';
};

type BusinessService = {
  name: string;
  icon: React.ElementType;
  logo?: string;
  content: string | React.ReactElement;
  category: string;
  description?: string;
  href?: string;
  externalUrl?: string;
};

type UserRole = 'Agent' | 'Corporate';

const paymentServices: PaymentService[] = [
  { 
    name: 'Electricity Payment', 
    icon: Zap,
    logo: '/logos/services/electricity.png',
    content: <ElectricityPayment />, 
    category: 'Utilities', 
    popularity: 95,
    description: 'Pay electricity bills instantly',
    status: 'active'
  },
  { 
    name: 'RRA Payment', 
    icon: FileText,
    logo: '/logos/services/rra.jpg',
    content: <RraPayment />, 
    category: 'Government', 
    popularity: 88,
    description: 'Tax payments made easy',
    status: 'active'
  },
  { 
    name: 'Buy Airtime', 
    icon: Phone,
    logo: '/logos/services/airtime.jpg',
    content: <AirtimePurchase />, 
    category: 'Telecom', 
    popularity: 92,
    description: 'Instant airtime top-up',
    status: 'active'
  },
  { 
    name: 'Startimes Payment', 
    icon: Tv,
    logo: '/logos/services/startime.png',
    content: <StartimesPayment />, 
    category: 'Entertainment', 
    popularity: 78,
    description: 'TV subscription payments',
    status: 'active'
  },
  { 
    name: 'Bulk SMS', 
    icon: MessageSquare,
    logo: '/logos/services/bulksms.png',
    content: <BulkSmsForm />, 
    category: 'Communication', 
    popularity: 82,
    description: 'Send messages in bulk',
    status: 'inactive'
  },
  { 
    name: 'Bulk Airtime', 
    icon: MessageSquare,
    logo: '/logos/services/airtime.jpg',
    content: <BulkAirtimeForm />, 
    category: 'Telecom', 
    popularity: 85,
    description: 'Airtime for multiple numbers',
    status: 'inactive'
  },
  { 
    name: 'Wasac', 
    icon: Droplet,
    logo: '/logos/services/wasac.jpg',
    content: <WASACPayment/>, 
    category: 'Utilities', 
    popularity: 75,
    description: 'Water bill payments',
    status: 'inactive'
  },
  { 
    name: 'Irembo Pay', 
    icon: Shield,
    logo: '/logos/services/irembo.png',
    content: <IremboPayment/>, 
    category: 'Government', 
    popularity: 80,
    description: 'Government services payment',
    status: 'inactive'
  },
  { 
    name: 'RNIT', 
    icon: Building2,
    logo: '/logos/services/rnit.png',
    content: <RNITPayment/>, 
    category: 'Government', 
    popularity: 72,
    description: 'National ID services',
    status: 'inactive'
  },
  { 
    name: 'School Fees', 
    icon: BookOpen,
    logo: '/logos/services/school.svg',
    content: <SchoolFeesPayment/>, 
    category: 'Education', 
    popularity: 79,
    description: 'School fee payments',
    status: 'inactive'
  },
  { 
    name: 'AQS Africa Collect', 
    icon: FileText,
    logo: '/logos/services/aqs.jpg',
    externalUrl: 'https://ee.kobotoolbox.org/x/p6HRmkv9',
    category: 'Data Collection', 
    popularity: 85,
    isFeatured: true,
    description: 'Data collection',
    status: 'active'
  },
];

const agencyBankingServices: AgencyBankingService[] = [
  { name: 'Ecobank', icon: Banknote, logo: '/logos/banks/ECOBANK.jpg', href: '/dashboard/services/agency-banking/ecobank', status: 'inactive' },
  { name: 'Bank of Kigali', icon: Building2, logo: '/logos/banks/bankofkigali.png', href: '/dashboard/balance', status: 'inactive' },
  { name: 'Equity Bank', icon: Landmark, logo: '/logos/banks/equity.jpg', href: '/dashboard/balance', status: 'inactive' },
  { name: 'GT Bank', icon: ShieldCheck, logo: '/logos/banks/gtbank.png', href: '/dashboard/balance', status: 'inactive' },
];

const businessServices: BusinessService[] = [
  { 
    name: 'Bulk Salary Payment', 
    icon: Users,
    logo: '/logos/services/salary.svg',
    content: <BulkSalaryPayment />, 
    category: 'Payroll',
    description: 'Process multiple salaries at once'
  },
  { 
    name: 'Invoice Payments', 
    icon: CreditCard,
    logo: '/logos/services/invoice.svg',
    content: <InvoicePayment />, 
    category: 'Finance',
    description: 'Manage and pay invoices'
  },
  { 
    name: 'Tax Calculation', 
    icon: Calculator,
    logo: '/logos/services/taxcalc.svg',
    content: <TaxCalculation />, 
    category: 'Finance',
    description: 'Automated tax calculations'
  },
  { 
    name: 'Expense Management', 
    icon: FileSpreadsheet,
    logo: '/logos/services/expense.svg', 
    content: <ExpenseManagement />, 
    category: 'Operations',
    description: 'Track and manage expenses'
  },
];

// Enhanced Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.08,
      duration: 0.6
    } 
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      duration: 0.4
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: -20,
    transition: { 
      duration: 0.3 
    } 
  }
};

const statsVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.5 
    } 
  }
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

export default function DashboardHome() {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<PaymentService | BusinessService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'new'>('popularity');
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.category;
  
  const isAgent = userRole === "Agent";
  const isBusiness = userRole === "Corporate";

  // Helper to get translation key from service name
  const getServiceKey = (name: string) => {
    return name.toLowerCase().replace(/ /g, '');
  };

  // Translated payment services - translate both names and descriptions
  const translatedPaymentServices: PaymentService[] = paymentServices.map(service => ({
    ...service,
    name: t(`services.${getServiceKey(service.name)}Name`) || service.name,
    description: t(`services.${getServiceKey(service.name)}Desc`) || service.description,
  }));

  // Translated agency banking services - keep names, translate descriptions only
  const translatedAgencyServices = agencyBankingServices.map(service => ({
    ...service,
    description: t(`services.${getServiceKey(service.name)}Desc`) || t('services.bankingServices'),
  }));

  // Translated business services - translate both names and descriptions
  const translatedBusinessServices: BusinessService[] = businessServices.map(service => ({
    ...service,
    name: t(`services.${getServiceKey(service.name)}Name`) || service.name,
    description: t(`services.${getServiceKey(service.name)}Desc`) || service.description,
  }));

  // Get unique categories for filtering
  const categories = ['All', ...new Set(translatedPaymentServices.map(service => service.category))];
  
  // Translate category names
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'All': t('services.all'),
      'Utilities': t('services.utilities'),
      'Telecom': t('services.telecom'),
      'Government': t('services.government'),
      'Communication': t('services.communication'),
      'Education': t('services.education'),
      'Entertainment': t('services.entertainment'),
    };
    return categoryMap[category] || category;
  };

  // Filter and sort payment services
  const filteredPaymentServices = useMemo(() => {
    let filtered = translatedPaymentServices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, activeCategory, sortBy, translatedPaymentServices]);

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
    service: Service & { isNew?: boolean; isFeatured?: boolean; status?: string; href?: string; description?: string },
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
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setHoveredService(service.name)}
        onHoverEnd={() => setHoveredService(null)}
        className={`${colors.bg} ${colors.border} rounded-2xl shadow-md hover:shadow-2xl p-6 cursor-pointer transition-all duration-300 group border border-gray-200 dark:border-gray-700 relative overflow-hidden ${
          service.status === 'inactive' ? 'opacity-60' : ''
        }`}
        onClick={() => {
          if (service.status === 'inactive') return;
          if (service.externalUrl) {
            window.open(service.externalUrl, '_blank', 'noopener,noreferrer');
          } else if (service.href) {
            router.push(service.href);
          } else {
            setSelectedService(service as PaymentService | BusinessService);
          }
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating Particles */}
        <AnimatePresence>
          {hoveredService === service.name && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-2 right-2 w-2 h-2 bg-[#ff6600] rounded-full"
                transition={{ delay: 0.1 }}
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#13294b] rounded-full"
                transition={{ delay: 0.2 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {service.status === 'active' && (
            <motion.span 
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg shadow-green-500/30"
            >
              {t('services.active')}
            </motion.span>
          )}
          {service.status === 'inactive' && (
            <motion.span 
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg shadow-red-500/30"
            >
              {t('services.inactive')}
            </motion.span>
          )}
        </div>

        <div className="relative z-10">
          {/* Image/Icon with Enhanced Animation */}
          <motion.div 
            className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${colors.iconBg} ${colors.iconColor} mb-4 flex items-center justify-center`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {service.logo ? (
              <div className="w-10 h-10 relative">
                <Image 
                  src={service.logo} 
                  alt={service.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <service.icon className="w-6 h-6" />
            )}
          </motion.div>

          {/* Content */}
          <div className="space-y-2">
            {sectionType === 'agency' ? (
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#ff6600] transition-colors text-lg leading-tight">
                {service.name}
              </h3>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description || 
                  (sectionType === 'payment' && t('services.quickPaymentService')) ||
                  (sectionType === 'business' && t('services.businessSolutions'))
                }
              </p>
            )}

            {/* Animated Arrow */}
            <motion.div 
              className="flex items-center justify-between mt-3"
              initial={false}
              animate={{ x: hoveredService === service.name ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex-1">
              </div>
              
              <motion.div
                className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-[#ff6600] group-hover:text-white transition-colors ${
                  service.status === 'inactive' ? 'opacity-50' : ''
                }`}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
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
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 sm:p-6 lg:p-8"
    >
      {/* Enhanced Header with Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="text-center mb-4 sm:mb-8 relative"
      >
        {/* Floating Background Elements */}
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-4 left-10 w-6 h-6 bg-[#ff6600]/20 rounded-full blur-sm"
        />
        <motion.div 
          animate={floatingAnimation}
          transition={{ delay: 1 }}
          className="absolute top-8 right-12 w-4 h-4 bg-[#13294b]/20 rounded-full blur-sm"
        />
        <motion.div 
          animate={floatingAnimation}
          transition={{ delay: 2 }}
          className="absolute bottom-4 left-1/4 w-3 h-3 bg-[#ff6600]/10 rounded-full blur-sm"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 mb-2 border border-gray-200 dark:border-gray-600 shadow-lg"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3 h-3 text-[#ff6600]" />
          </motion.div>
          <span className="text-xs text-gray-600 dark:text-gray-300 font-normal">
            {t('services.welcomeBack', { name: user?.name || t('services.user') })}
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#13294b] via-[#ff6600] to-[#13294b] bg-clip-text text-transparent mb-2"
        >
          {t('services.dashboard')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-normal mb-6"
        >
          {isAgent ? t('services.comprehensiveAgencyPlatform') : t('services.advancedBusinessPlatform')}
        </motion.p>

        {/* Prominent Search Box in Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="relative group">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#ff6600] to-orange-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              whileHover={{ scale: 1.02 }}
            />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ff6600] w-5 h-5 z-10" />
              <input
                type="text"
                placeholder={t('services.searchServices')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all shadow-md hover:shadow-xl dark:shadow-black/30"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#ff6600] transition-colors z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-[#ff6600]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <motion.h3 
                  className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedService.logo ? (
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image 
                        src={selectedService.logo} 
                        alt={selectedService.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : selectedService.icon && React.createElement(selectedService.icon, { 
                    className: "w-6 h-6 text-[#ff6600]" 
                  })}
                  <span className="truncate">{selectedService.name}</span>
                </motion.h3>
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                <motion.div 
                  className="text-gray-800 dark:text-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {typeof selectedService.content === 'string' ? (
                    <div className="text-center py-8 text-lg">{selectedService.content}</div>
                  ) : (
                    <div className="w-full h-full">{selectedService.content}</div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Payment Services with Advanced Filters */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b-2 border-gray-100 dark:border-gray-700">
            <div>
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#13294b] to-[#ff6600] bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t('services.paymentServices')}
              </motion.h2>
              <motion.p 
                className="text-gray-500 dark:text-gray-400 mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {t('services.paymentServicesDesc')}
              </motion.p>
            </div>
            <motion.div 
              className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#ff6600] to-orange-400 rounded-full lg:hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6 }}
            />
          </div>

          {/* Enhanced Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Category Filter */}
              <motion.div 
                className="flex flex-wrap gap-2 w-full sm:flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-[#ff6600] to-orange-500 text-white shadow-lg shadow-[#ff6600]/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {translateCategory(category)}
                  </motion.button>
                ))}
              </motion.div>

              {/* Sort Dropdown */}
              <motion.div 
                className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Filter className="w-5 h-5 text-[#ff6600]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-0 px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="popularity">{t('services.mostPopular')}</option>
                  <option value="name">{t('services.alphabetical')}</option>
                  <option value="new">{t('services.newFirst')}</option>
                </select>
              </motion.div>
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
              {(searchTerm || activeCategory !== 'All') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700"
                >
                  {searchTerm && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#13294b]/10 to-[#13294b]/5 dark:from-[#13294b]/30 dark:to-[#13294b]/20 text-[#13294b] dark:text-[#60a5fa] text-sm px-4 py-2 rounded-full border border-[#13294b]/20 dark:border-[#13294b]/40"
                    >
                      <Search className="w-4 h-4" />
                      {t('services.search')}: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-[#ff6600] transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.span>
                  )}
                  {activeCategory !== 'All' && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6600]/10 to-[#ff6600]/5 dark:from-[#ff6600]/30 dark:to-[#ff6600]/20 text-[#ff6600] dark:text-[#fbbf24] text-sm px-4 py-2 rounded-full border border-[#ff6600]/20 dark:border-[#ff6600]/40"
                    >
                      <Filter className="w-4 h-4" />
                      {t('services.category')}: {translateCategory(activeCategory)}
                      <button onClick={() => setActiveCategory('All')} className="hover:text-[#ff6600] transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredPaymentServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                layoutId={`service-${service.name}`}
              >
                {renderServiceCard(service, 'payment')}
              </motion.div>
            ))}
          </motion.div>

          {/* No Results State */}
          <AnimatePresence>
            {filteredPaymentServices.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Target className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-4"
                >
                  {t('services.noServicesFound')}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 dark:text-gray-500 text-sm mb-8"
                >
                  {t('services.tryAdjustingFilters')}
                </motion.p>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                  }}
                  className="bg-gradient-to-r from-[#ff6600] to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#ff6600]/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('services.clearAllFilters')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Agency Banking - Show only for Agents */}
        {isAgent && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#13294b] to-[#ff6600] bg-clip-text text-transparent">
                  {t('services.agencyBanking')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {t('services.agencyBankingDesc')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {translatedAgencyServices.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  {renderServiceCard(service, 'agency')}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Business Services - Show only for Business users */}
        {isBusiness && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#13294b] to-[#ff6600] bg-clip-text text-transparent">
                  {t('services.businessServices')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {t('services.businessServicesDesc')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {translatedBusinessServices.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  {renderServiceCard(service, 'business')}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Enhanced Stats Section */}
      <motion.div 
        variants={statsVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mt-12 mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {[
          {
            icon: TrendingUp,
            value: translatedPaymentServices.length,
            label: t('services.totalServices'),
            color: 'from-[#ff6600] to-orange-400',
            bg: 'bg-[#ff660020] dark:bg-[#ff660030]'
          },
          {
            icon: Star,
            value: translatedPaymentServices.filter(s => s.isFeatured).length,
            label: t('services.featured'),
            color: 'from-yellow-400 to-orange-400',
            bg: 'bg-yellow-100 dark:bg-yellow-900/20'
          },
          {
            icon: Clock,
            value: '24/7',
            label: t('services.available'),
            color: 'from-[#13294b] to-[#ff6600]',
            bg: 'bg-[#13294b]/10 dark:bg-[#13294b]/20'
          },
          {
            icon: Shield,
            value: '100%',
            label: t('services.secure'),
            color: 'from-green-500 to-emerald-400',
            bg: 'bg-green-100 dark:bg-green-900/20'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ 
              y: -5,
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </motion.div>
              <div>
                <motion.div 
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Role Display */}
      <motion.div 
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 shadow-2xl rounded-2xl px-4 py-3 border-2 border-[#ff6600]/20 backdrop-blur-sm z-40"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className={`w-3 h-3 rounded-full ${isAgent ? 'bg-[#13294b]' : 'bg-[#ff6600]'}`}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {userRole} {t('services.mode')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isAgent ? t('services.agencyServices') : t('services.businessTools')}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}