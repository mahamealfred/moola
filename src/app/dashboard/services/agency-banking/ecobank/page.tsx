'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Download,
  Upload,
  SendHorizonal,
  KeyRound,
  Landmark,
  X,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  Star,
  Crown,
  Rocket,
  Target,
  Banknote
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

import OpenAccount from './account-openning/page';
import DepositForm from './deposit/page';
import RemittanceForm from './remittance/page';
import Withdrawal from './withdral/page';
import ExpressCashToken from './expressCashToken/page';

type EcobankServices = {
  name: string;
  icon: React.ElementType;
  content: string | React.ReactElement;
  category: string;
  status: 'active' | 'coming-soon' | 'new';
  popularity?: number;
  description?: string;
};

const ecobankServices: EcobankServices[] = [
  { 
    name: 'Open Account', 
    icon: UserPlus, 
    content: "Stay tuned—we're working to bring you a faster, easier way to open your Ecobank account right here.", 
    category: 'Account',
    status: 'coming-soon',
    popularity: 85,
    description: 'Digital account opening'
  },
  { 
    name: 'Deposit', 
    icon: Download, 
    content: <DepositForm />, 
    category: 'Transactions',
    status: 'active',
    popularity: 92,
    description: 'Make deposits instantly'
  },
  { 
    name: 'Withdrawal', 
    icon: Upload, 
    content: <Withdrawal/>, 
    category: 'Transactions',
    status: 'active',
    popularity: 88,
    description: 'Withdraw funds securely'
  },
  { 
    name: 'Remittance', 
    icon: SendHorizonal, 
    content: "Soon, you'll be able to send and receive money seamlessly through Ecobank right here.", 
    category: 'Transfers',
    status: 'coming-soon',
    popularity: 79,
    description: 'Send and receive money'
  },
  { 
    name: 'Express Cash Token', 
    icon: KeyRound, 
    content: <ExpressCashToken />, 
    category: 'Security',
    status: 'new',
    popularity: 82,
    description: 'Secure token generation'
  },
  { 
    name: 'Interbank', 
    icon: Landmark, 
    content: "The Interbank service with Ecobank will be available shortly. Easily transfer funds between banks—fast, secure, and convenient.", 
    category: 'Transfers',
    status: 'coming-soon',
    popularity: 76,
    description: 'Transfer between banks'
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

export default function EcobankServicesPage() {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<EcobankServices | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'status'>('popularity');
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // Get unique categories for filtering
  const categories = ['All', ...new Set(ecobankServices.map(service => service.category))];
  
  // Translate category names
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'All': t('ecobank.all'),
      'Transactions': t('ecobank.transactions'),
      'Account': t('ecobank.account'),
      'Security': t('ecobank.security'),
      'Transfers': t('ecobank.transfers'),
    };
    return categoryMap[category] || category;
  };

  // Helper to get translation key from service name (convert to camelCase)
  const getServiceKey = (name: string) => {
    return name
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  };

  // Translate services
  const translatedServices: EcobankServices[] = ecobankServices.map(service => ({
    ...service,
    name: t(`ecobank.${getServiceKey(service.name)}`) || service.name,
    description: t(`ecobank.${getServiceKey(service.name)}Desc`) || service.description,
  }));

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = translatedServices;

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
        filtered = filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'status':
        filtered = filtered.sort((a, b) => {
          const statusOrder = { 'active': 0, 'new': 1, 'coming-soon': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        break;
    }

    return filtered;
  }, [searchTerm, activeCategory, sortBy, translatedServices]);

  // Count services by status
  const activeServicesCount = translatedServices.filter(s => s.status === 'active').length;
  const newServicesCount = translatedServices.filter(s => s.status === 'new').length;

  const renderServiceCard = (service: EcobankServices) => (
    <motion.div
      key={service.name}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setHoveredService(service.name)}
      onHoverEnd={() => setHoveredService(null)}
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl p-5 cursor-pointer transition-all duration-300 border-2 relative overflow-hidden ${
        service.status === 'coming-soon' ? 'opacity-60' : 'border-gray-100 dark:border-gray-800'
      }`}
      onClick={() => {
        if (service.status === 'coming-soon') return;
        setSelectedService(service);
      }}
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        whileHover={{ scale: 1.1 }}
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

      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        {service.status === 'new' && (
          <motion.span 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
          >
            <Rocket className="w-3 h-3" />
            {t('ecobank.new')}
          </motion.span>
        )}
        {service.status === 'coming-soon' && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium"
          >
            {t('ecobank.comingSoon')}
          </motion.span>
        )}
        {service.status === 'active' && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="bg-[#ff6600] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            {t('ecobank.active')}
          </motion.span>
        )}
      </div>

      <div className="relative z-10">
        {/* Icon with Enhanced Animation */}
        <motion.div 
          className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] mb-4`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <service.icon className="w-6 h-6" />
        </motion.div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#ff6600] transition-colors text-lg leading-tight">
            {service.name} 
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {service.description || 'Ecobank banking service'}
          </p>

          {/* Animated Arrow and Popularity */}
          <motion.div 
            className="flex items-center justify-between mt-3"
            initial={false}
            animate={{ x: hoveredService === service.name ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex-1">
              {/* Category tag */}
              <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded">
                {translateCategory(service.category)}
              </span>
            </div>
            
            <motion.div
              className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-[#ff6600] group-hover:text-white transition-colors ${
                service.status === 'coming-soon' ? 'opacity-50' : ''
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* Popularity indicator - Removed progress bar, showing only percentage */}
          {service.popularity && (
            <motion.div 
              className="flex items-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {service.popularity}% {t('ecobank.popular')}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 p-4 sm:p-6 lg:p-8"
    >
      {/* Enhanced Header with Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="text-center mb-8 sm:mb-12 relative"
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
          className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-gray-200 dark:border-gray-600 shadow-lg"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-[#ff6600]" />
          </motion.div>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {t('ecobank.digitalServices')}
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#13294b] via-[#ff6600] to-[#13294b] bg-clip-text text-transparent mb-4"
        >
          {t('ecobank.bankingServices')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto"
        >
          {t('ecobank.subtitle')}
        </motion.p>
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
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="p-2 rounded-lg bg-[#ff660020] dark:bg-[#ff660030]">
                    {selectedService.icon && React.createElement(selectedService.icon, { 
                      className: "w-6 h-6 text-[#ff6600]" 
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedService.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedService.description}
                    </p>
                  </div>
                </motion.div>
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

      {/* Enhanced Stats Section */}
      <motion.div 
        variants={statsVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {[
          {
            icon: Banknote,
            value: ecobankServices.length,
            label: t('ecobank.totalServices'),
            color: 'from-[#ff6600] to-orange-400',
            bg: 'bg-[#ff660020] dark:bg-[#ff660030]'
          },
          {
            icon: Zap,
            value: activeServicesCount,
            label: t('ecobank.active'),
            color: 'from-green-500 to-emerald-400',
            bg: 'bg-green-100 dark:bg-green-900/20'
          },
          {
            icon: Clock,
            value: '24/7',
            label: t('ecobank.available'),
            color: 'from-[#13294b] to-[#ff6600]',
            bg: 'bg-[#13294b]/10 dark:bg-[#13294b]/20'
          },
          {
            icon: Shield,
            value: '100%',
            label: t('ecobank.secure'),
            color: 'from-[#ff6600] to-[#ff8c00]',
            bg: 'bg-[#ff6600]/10 dark:bg-[#ff6600]/20'
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

      {/* Services Section with Enhanced Filters */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h2 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t('ecobank.availableServices')}
            </motion.h2>
            <motion.p 
              className="text-gray-500 dark:text-gray-400 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {t('ecobank.exploreServices')}
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
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border-2 border-gray-100 dark:border-gray-800 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Box */}
            <motion.div 
              className="flex-1 w-full sm:max-w-xs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('ecobank.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div 
              className="flex flex-wrap gap-2"
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-[#ff6600] text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition-all"
              >
                <option value="popularity">{t('ecobank.mostPopular')}</option>
                <option value="name">{t('ecobank.alphabetical')}</option>
                <option value="status">{t('ecobank.byStatus')}</option>
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
                className="mt-4 flex flex-wrap gap-2"
              >
                {searchTerm && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full"
                  >
                    {t('ecobank.search')}: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}
                {activeCategory !== 'All' && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full"
                  >
                    {t('ecobank.category')}: {translateCategory(activeCategory)}
                    <button onClick={() => setActiveCategory('All')} className="hover:text-green-600">
                      <X className="w-3 h-3" />
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              layoutId={`service-${service.name}`}
            >
              {renderServiceCard(service)}
            </motion.div>
          ))}
        </motion.div>

        {/* No Results State */}
        <AnimatePresence>
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
                No services found matching your criteria
              </div>
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="text-[#ff6600] hover:text-[#e65c00] font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('ecobank.clearAllFilters')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Enhanced Service Status Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto mt-8 sm:mt-12"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-800 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('ecobank.serviceStatusOverview')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div 
              className="flex items-center gap-3 p-4 bg-[#ff6600]/5 dark:bg-[#ff6600]/10 rounded-xl border border-[#ff6600]/20 dark:border-[#ff6600]/30"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-3 h-3 bg-[#ff6600] rounded-full"
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
                <div className="font-bold text-gray-900 dark:text-white">{activeServicesCount} {t('ecobank.active')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('ecobank.readyToUse')}</div>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{newServicesCount} {t('ecobank.new')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('ecobank.recentlyAdded')}</div>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-3 h-3 bg-gray-500 rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut"
                }}
              />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {ecobankServices.length - activeServicesCount - newServicesCount} {t('ecobank.comingSoon')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('ecobank.inDevelopment')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}