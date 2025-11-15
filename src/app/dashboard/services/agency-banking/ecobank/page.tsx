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
  TrendingUp
} from 'lucide-react';

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
  const [selectedService, setSelectedService] = useState<EcobankServices | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'status'>('popularity');

  // Get unique categories for filtering
  const categories = ['All', ...new Set(ecobankServices.map(service => service.category))];

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = ecobankServices;

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
  }, [searchTerm, activeCategory, sortBy]);

  // Count services by status
  const activeServicesCount = ecobankServices.filter(s => s.status === 'active').length;
  const newServicesCount = ecobankServices.filter(s => s.status === 'new').length;

  const renderServiceCard = (service: EcobankServices) => (
    <motion.div
      key={service.name}
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative ${
        service.status === 'coming-soon' ? 'opacity-60' : ''
      }`}
      onClick={() => {
        if (service.status === 'coming-soon') return;
        setSelectedService(service);
      }}
    >
      {/* Status Badges */}
      <div className="absolute top-4 right-4 flex gap-1">
        {service.status === 'new' && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            New
          </span>
        )}
        {service.status === 'coming-soon' && (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        )}
        {service.status === 'active' && (
          <span className="bg-[#ff6600] text-white text-xs px-2 py-1 rounded-full font-medium">
            Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] rounded-full p-3 transition-all duration-300 group-hover:scale-110">
          <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#ff6600] transition-colors text-base sm:text-lg truncate">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
            {service.description || 'Ecobank banking service'}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-[#ff6600] transition-colors flex-shrink-0 ${
          service.status === 'coming-soon' ? 'opacity-50' : ''
        }`} />
      </div>

      {/* Popularity indicator */}
      {service.popularity && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-[#ff6600] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${service.popularity}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {service.popularity}%
          </span>
        </div>
      )}

      {/* Category tag */}
      <div className="mt-3">
        <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded">
          {service.category}
        </span>
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
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-gray-200 dark:border-gray-600">
          <Sparkles className="w-4 h-4 text-[#ff6600]" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Ecobank Digital Services
          </span>
        </div>
        
      
        <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Complete banking solutions at your fingertips
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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#ff660020] dark:bg-[#ff660030]">
                    {selectedService.icon && React.createElement(selectedService.icon, { 
                      className: "w-5 h-5 sm:w-6 sm:h-6 text-[#ff6600]" 
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                      {selectedService.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedService.description}
                    </p>
                  </div>
                </div>
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
                {ecobankServices.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Services</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-900/20">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeServicesCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
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

      {/* Services Section with Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
              Available Services
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Explore all Ecobank digital banking services
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
                <option value="status">By Status</option>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredServices.map((service) => renderServiceCard(service))}
        </motion.div>

        {/* No Results State */}
        {filteredServices.length === 0 && (
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

      {/* Service Status Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto mt-8 sm:mt-12"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Service Status Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{activeServicesCount} Active</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ready to use</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{newServicesCount} New</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Recently added</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {ecobankServices.length - activeServicesCount - newServicesCount} Coming Soon
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">In development</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}