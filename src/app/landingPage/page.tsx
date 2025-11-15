'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, Variants, easeOut, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, X, Quote, Download, Smartphone, Wifi, Home, Car, Heart, ShoppingCart } from 'lucide-react';
import {
  Sun,
  Moon,
  Zap,
  Phone,
  FileText,
  Tv,
  MessageSquare,
  Globe,
  Building,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Droplet,
  BookOpen,
  CreditCard,
  Calculator,
  FileSpreadsheet,
  Banknote,
  ShieldCheck,
  Sparkles,
  Star,
  Play,
  Pause,
  Lock,
  Eye,
  TrendingUp,
  BarChart3,
  Wallet,
  QrCode,
  Send,
  Receipt,
  Calendar,
  Bell,
  Fingerprint,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n-context';
import FlagLanguageSelector from '@/components/FlagLanguageSelector';

// Testimonials Data
/*
const testimonials = [
  {
    id: 1,
    name: "Alice Uwase",
    role: "Small Business Owner",
    content: "Moola has transformed how I manage my business payments. The bulk salary feature saves me hours every month!",
    rating: 5,
    avatar: "AU"
  },
  {
    id: 2,
    name: "David Mugisha",
    role: "University Student",
    content: "Paying school fees and electricity bills has never been easier. The interface is intuitive and payments are instant.",
    rating: 5,
    avatar: "DM"
  },
  {
    id: 3,
    name: "Grace Niyomugabo",
    role: "Finance Manager",
    content: "The security features give me confidence to handle large transactions. Excellent platform for corporate payments.",
    rating: 4,
    avatar: "GN"
  },
  {
    id: 4,
    name: "Eric Habimana",
    role: "Freelancer",
    content: "I use Moola for all my utility payments and tax calculations. It's reliable and saves me so much time.",
    rating: 5,
    avatar: "EH"
  }
];
*/

// All Services Data with consistent icon colors
/*
const allServices = [
  { name: 'Electricity Payment', icon: Zap, category: 'Utilities', description: 'Pay electricity bills instantly', color: 'text-yellow-500' },
  { name: 'RRA Tax Payment', icon: FileText, category: 'Government', description: 'Handle tax payments efficiently', color: 'text-red-500' },
  { name: 'Buy Airtime', icon: Phone, category: 'Telecom', description: 'Top up any mobile network', color: 'text-green-500' },
  { name: 'Startimes TV', icon: Tv, category: 'Entertainment', description: 'Subscribe to TV packages', color: 'text-purple-500' },
  { name: 'Bulk SMS', icon: MessageSquare, category: 'Communication', description: 'Send messages to multiple recipients', color: 'text-blue-500' },
  { name: 'Irembo Services', icon: Globe, category: 'Government', description: 'Access government services', color: 'text-indigo-500' },
  { name: 'WASAC Water', icon: Droplet, category: 'Utilities', description: 'Pay water bills online', color: 'text-cyan-500' },
  { name: 'School Fees', icon: BookOpen, category: 'Education', description: 'Education fee payments', color: 'text-orange-500' },
  { name: 'Bulk Salary', icon: Users, category: 'Business', description: 'Manage payroll payments', color: 'text-teal-500' },
  { name: 'Invoice Payments', icon: CreditCard, category: 'Business', description: 'Handle invoice processing', color: 'text-pink-500' },
  { name: 'Tax Calculation', icon: Calculator, category: 'Business', description: 'Automated tax calculations', color: 'text-gray-600' },
  { name: 'Expense Management', icon: FileSpreadsheet, category: 'Business', description: 'Track business expenses', color: 'text-amber-600' },
  { name: 'Mobile Money', icon: Smartphone, category: 'Finance', description: 'Send and receive money via mobile', color: 'text-green-600' },
  { name: 'Internet Bills', icon: Wifi, category: 'Utilities', description: 'Pay internet service providers', color: 'text-blue-600' },
  { name: 'Rent Payment', icon: Home, category: 'Housing', description: 'Pay rent and housing fees', color: 'text-brown-500' },
  { name: 'Transport', icon: Car, category: 'Transport', description: 'Bus tickets and transport payments', color: 'text-gray-500' },
  { name: 'Health Insurance', icon: Heart, category: 'Insurance', description: 'Medical and health payments', color: 'text-red-400' },
  { name: 'Online Shopping', icon: ShoppingCart, category: 'Shopping', description: 'E-commerce payments', color: 'text-purple-600' },
];
*/

// New Payment Features
/*const paymentFeatures = [
  {
    title: 'QR Code Payments',
    description: 'Scan to pay instantly with QR codes',
    icon: QrCode,
    color: 'text-green-500'
  },
  {
    title: 'Money Transfer',
    description: 'Send money to anyone, anywhere in Rwanda',
    icon: Send,
    color: 'text-blue-500'
  },
  {
    title: 'Bill Splitting',
    description: 'Split bills with friends and family easily',
    icon: Receipt,
    color: 'text-purple-500'
  },
  {
    title: 'Scheduled Payments',
    description: 'Automate your recurring payments',
    icon: Calendar,
    color: 'text-orange-500'
  }
];

// Security Features
/*const securityFeatures = [
  {
    title: 'Biometric Authentication',
    description: 'Secure your account with fingerprint or face ID',
    icon: Lock,
    color: 'text-red-500'
  },
  {
    title: 'Real-time Monitoring',
    description: '24/7 transaction monitoring and alerts',
    icon: Eye,
    color: 'text-blue-500'
  },
  {
    title: 'Instant Notifications',
    description: 'Get instant SMS and email notifications',
    icon: Bell,
    color: 'text-green-500'
  },
  {
    title: 'Two-Factor Auth',
    description: 'Extra layer of security for your account',
    icon: ShieldCheck,
    color: 'text-purple-500'
  }
];*/

// Banks
/*const banks = [
  { name: 'Equity Bank', icon: Building, color: 'text-blue-600' },
  { name: 'Bank of Kigali', icon: Building, color: 'text-green-600' },
  { name: 'Ecobank', icon: Building, color: 'text-orange-600' },
  { name: 'GT Bank', icon: Building, color: 'text-red-600' },
  { name: 'I&M Bank', icon: Building, color: 'text-purple-600' },
  { name: 'Cogebank', icon: Building, color: 'text-teal-600' },
];*/

// Benefits
/*const benefits = [
  { 
    title: 'Secure Transactions', 
    description: 'Bank-level security for all your payments', 
    icon: Shield,
    color: 'text-green-500'
  },
  { 
    title: '24/7 Availability', 
    description: 'Access services anytime, anywhere', 
    icon: Users,
    color: 'text-blue-500'
  },
  { 
    title: 'Instant Processing', 
    description: 'No delays in transaction processing', 
    icon: CheckCircle,
    color: 'text-purple-500'
  },
  {
    title: 'Low Fees',
    description: 'Competitive rates with no hidden charges',
    icon: Banknote,
    color: 'text-green-600'
  }
];*/

// Pie Chart Icon Component (typed and hoisted before usage)
const PieChart = ({ className, color = 'currentColor' }: { className?: string; color?: string }): React.ReactElement => (
  <svg className={className} fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 2.07c3.07.38 5.57 2.52 6.54 5.36L13 9.13V4.07zM4 12c0-4.08 3.06-7.44 7-7.93v15.87c-3.94-.49-7-3.85-7-7.94zm9 7.93V13.9l5.02 5.02c-1.41 1.31-3.27 2.11-5.02 2.01z"/>
  </svg>
);

// Mobile App Features
/*const appFeatures = [
  {
    title: 'Easy Dashboard',
    description: 'Manage all your payments in one place',
    icon: BarChart3,
    color: 'text-blue-500'
  },
  {
    title: 'Quick Transactions',
    description: 'Send money in just a few taps',
    icon: TrendingUp,
    color: 'text-green-500'
  },
  {
    title: 'Digital Wallet',
    description: 'Store multiple payment methods securely',
    icon: Wallet,
    color: 'text-purple-500'
  },
  {
    title: 'Budget Tracking',
    description: 'Monitor your spending and set limits',
    icon: PieChart,
    color: 'text-orange-500'
  }
];*/

// Animation Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

/*const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut }
  }
};*/

/*const slideIn: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOut }
  }
};*/

export default function LandingPage() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);
  const [newService, setNewService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  // const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();

  // const itemsPerView = 3;

  const testimonials = [
    {
      id: 1,
      name: t('landing.testimonial1Name'),
      role: t('landing.testimonial1Role'),
      content: t('landing.testimonial1Content'),
      rating: 5,
      avatar: "AU"
    },
    {
      id: 2,
      name: t('landing.testimonial2Name'),
      role: t('landing.testimonial2Role'),
      content: t('landing.testimonial2Content'),
      rating: 5,
      avatar: "DM"
    },
    {
      id: 3,
      name: t('landing.testimonial3Name'),
      role: t('landing.testimonial3Role'),
      content: t('landing.testimonial3Content'),
      rating: 4,
      avatar: "GN"
    },
    {
      id: 4,
      name: t('landing.testimonial4Name'),
      role: t('landing.testimonial4Role'),
      content: t('landing.testimonial4Content'),
      rating: 5,
      avatar: "EH"
    }
  ];

  const allServicesTranslated = [
    { name: t('landing.electricityPayment'), icon: Zap, category: 'Utilities', description: t('landing.electricityPaymentDesc'), color: 'text-yellow-500' },
    { name: t('landing.rraTaxPayment'), icon: FileText, category: 'Government', description: t('landing.rraTaxPaymentDesc'), color: 'text-red-500' },
    { name: t('landing.buyAirtime'), icon: Phone, category: 'Telecom', description: t('landing.buyAirtimeDesc'), color: 'text-green-500' },
    { name: t('landing.startimesTV'), icon: Tv, category: 'Entertainment', description: t('landing.startimesTVDesc'), color: 'text-purple-500' },
    { name: t('landing.bulkSMS'), icon: MessageSquare, category: 'Communication', description: t('landing.bulkSMSDesc'), color: 'text-blue-500' },
    { name: t('landing.iremboServices'), icon: Globe, category: 'Government', description: t('landing.iremboServicesDesc'), color: 'text-indigo-500' },
    { name: t('landing.wasacWater'), icon: Droplet, category: 'Utilities', description: t('landing.wasacWaterDesc'), color: 'text-cyan-500' },
    { name: t('landing.schoolFees'), icon: BookOpen, category: 'Education', description: t('landing.schoolFeesDesc'), color: 'text-orange-500' },
    { name: t('landing.bulkSalary'), icon: Users, category: 'Business', description: t('landing.bulkSalaryDesc'), color: 'text-teal-500' },
    { name: t('landing.invoicePayments'), icon: CreditCard, category: 'Business', description: t('landing.invoicePaymentsDesc'), color: 'text-pink-500' },
    { name: t('landing.taxCalculation'), icon: Calculator, category: 'Business', description: t('landing.taxCalculationDesc'), color: 'text-gray-600' },
    { name: t('landing.expenseManagement'), icon: FileSpreadsheet, category: 'Business', description: t('landing.expenseManagementDesc'), color: 'text-amber-600' },
    { name: t('landing.mobileMoney'), icon: Smartphone, category: 'Finance', description: t('landing.mobileMoneyDesc'), color: 'text-green-600' },
    { name: t('landing.internetBills'), icon: Wifi, category: 'Utilities', description: t('landing.internetBillsDesc'), color: 'text-blue-600' },
    { name: t('landing.rentPayment'), icon: Home, category: 'Housing', description: t('landing.rentPaymentDesc'), color: 'text-brown-500' },
    { name: t('landing.transport'), icon: Car, category: 'Transport', description: t('landing.transportDesc'), color: 'text-gray-500' },
    { name: t('landing.healthInsurance'), icon: Heart, category: 'Insurance', description: t('landing.healthInsuranceDesc'), color: 'text-red-400' },
    { name: t('landing.onlineShopping'), icon: ShoppingCart, category: 'Shopping', description: t('landing.onlineShoppingDesc'), color: 'text-purple-600' },
  ];

  const paymentFeaturesTranslated = [
    {
      title: t('landing.qrCodePayments'),
      description: t('landing.qrCodePaymentsDesc'),
      icon: QrCode,
      color: 'text-green-500'
    },
    {
      title: t('landing.moneyTransferFeature'),
      description: t('landing.moneyTransferFeatureDesc'),
      icon: Send,
      color: 'text-blue-500'
    },
    {
      title: t('landing.billSplitting'),
      description: t('landing.billSplittingDesc'),
      icon: Receipt,
      color: 'text-purple-500'
    },
    {
      title: t('landing.scheduledPayments'),
      description: t('landing.scheduledPaymentsDesc'),
      icon: Calendar,
      color: 'text-orange-500'
    }
  ];

  const securityFeaturesTranslated = [
    {
      title: t('landing.biometricAuth'),
      description: t('landing.biometricAuthDesc'),
      icon: Lock,
      color: 'text-red-500'
    },
    {
      title: t('landing.realtimeMonitoring'),
      description: t('landing.realtimeMonitoringDesc'),
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: t('landing.instantNotifications'),
      description: t('landing.instantNotificationsDesc'),
      icon: Bell,
      color: 'text-green-500'
    },
    {
      title: t('landing.twoFactorAuth'),
      description: t('landing.twoFactorAuthDesc'),
      icon: ShieldCheck,
      color: 'text-purple-500'
    }
  ];

  const banksTranslated = [
    { name: t('landing.equityBank'), icon: Building, color: 'text-blue-600' },
    { name: t('landing.bankOfKigali'), icon: Building, color: 'text-green-600' },
    { name: t('landing.ecobank'), icon: Building, color: 'text-orange-600' },
    { name: t('landing.gtBank'), icon: Building, color: 'text-red-600' },
    { name: t('landing.imBank'), icon: Building, color: 'text-purple-600' },
    { name: t('landing.cogebank'), icon: Building, color: 'text-teal-600' },
  ];

  const benefitsTranslated = [
    { 
      title: t('landing.secureTransactions'), 
      description: t('landing.secureTransactionsDesc'), 
      icon: Shield,
      color: 'text-green-500'
    },
    { 
      title: t('landing.availability247'), 
      description: t('landing.availability247Desc'), 
      icon: Users,
      color: 'text-blue-500'
    },
    { 
      title: t('landing.instantProcessing'), 
      description: t('landing.instantProcessingDesc'), 
      icon: CheckCircle,
      color: 'text-purple-500'
    },
    {
      title: t('landing.lowFees'),
      description: t('landing.lowFeesDesc'),
      icon: Banknote,
      color: 'text-green-600'
    }
  ];

  const appFeaturesTranslated = [
    { title: t('landing.faceID'), icon: Fingerprint, color: 'text-blue-500' },
    { title: t('landing.instantTransfers'), icon: Zap, color: 'text-yellow-500' },
    { title: t('landing.billReminders'), icon: Bell, color: 'text-red-500' },
    { title: t('landing.multiCurrency'), icon: DollarSign, color: 'text-green-500' },
    { title: t('landing.offlineMode'), icon: Wifi, color: 'text-purple-500' },
    { title: t('landing.analytics'), icon: TrendingUp, color: 'text-orange-500' }
  ];

  // Get unique categories
  const categories = ['All', ...new Set(allServicesTranslated.map(service => service.category))];

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = allServicesTranslated;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    return filtered;
  }, [searchTerm, activeCategory, allServicesTranslated]);

  // Update carousel to use filtered services
  const displayServices = filteredServices.length > 0 ? filteredServices : allServicesTranslated;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % paymentFeaturesTranslated.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [paymentFeaturesTranslated.length]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextTheme);
  };

  const goToLogin = () => router.push('/login');

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.trim().length > 2) {
      setSubmitted(true);
      setNewService('');
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      alert('Please enter a valid service name');
    }
  };

  /*
  const nextSlide = () => {
    setCurrent((prev) =>
      prev + itemsPerView >= displayServices.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev - itemsPerView < 0
        ? Math.max(displayServices.length - itemsPerView, 0)
        : prev - itemsPerView
    );
  };
  */

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700 overflow-x-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-96 h-96 bg-[#13294b]/10 dark:bg-[#13294b]/20 blur-3xl rounded-full top-10 left-1/4"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          className="absolute w-64 h-64 bg-[#ff6600]/10 dark:bg-[#ff6600]/20 blur-2xl rounded-full bottom-10 right-1/4"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 blur-3xl rounded-full top-1/2 left-10"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center"
      >
        {/* Enhanced Logo Component */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 0] }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            {/* Enhanced Logo Container */}
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 border-2 border-white/20">
                <span className="text-white font-black text-2xl tracking-tighter drop-shadow-lg">M</span>
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-2xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-500 -z-10" />
            </div>
            
            {/* Enhanced Text Logo */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-[#ff6600] via-[#ff7700] to-[#ff8533] bg-clip-text text-transparent drop-shadow-sm">
                  M
                </span>
                <span className="text-[#13294b] dark:text-white drop-shadow-sm">oola</span>
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium tracking-wider mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                Premium Payment Solutions
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <FlagLanguageSelector />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Light/Dark Mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Enhanced Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-center pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center bg-gradient-to-r from-[#ff6600]/10 to-[#13294b]/10 dark:from-[#ff6600]/20 dark:to-[#13294b]/20 text-[#ff6600] dark:text-[#ffcc99] px-6 py-3 rounded-full text-sm font-medium mb-8 border border-[#ff6600]/20"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t('landing.leadingPlatform')}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#13294b] dark:text-white mb-6 leading-tight"
        >
          {t('landing.heroTitle')}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="block bg-gradient-to-r from-[#ff6600] to-[#ff8c00] bg-clip-text text-transparent"
          >
            {t('landing.paymentSolution')}
          </motion.span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg sm:text-xl max-w-4xl mx-auto text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
        >
          {t('landing.heroDescription')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/registration"
              className="px-6 py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 shadow-lg hover:shadow-[#ff6600]/25 flex items-center justify-center gap-3 text-base"
            >
              {t('landing.getStarted')} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="px-6 py-3 border-2 border-[#13294b] text-[#13294b] dark:border-gray-400 dark:text-gray-300 rounded-2xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl text-base"
            >
              {t('landing.signIn')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          {[
            { number: '50K+', label: t('landing.happyUsers') },
            { number: '1M+', label: t('landing.transactions') },
            { number: '99.9%', label: t('landing.uptime') }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-[#ff6600]">{stat.number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Payment Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-[#13294b] dark:text-white mb-4">
            {t('landing.smartPayment')} <span className="text-[#ff6600]">{t('landing.paymentFeatures')}</span>
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('landing.paymentFeaturesDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Animated Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center`}>
                    {(() => {
                      const Icon = paymentFeaturesTranslated[activeFeature].icon as any;
                      return <Icon className={`w-10 h-10 ${paymentFeaturesTranslated[activeFeature].color}`} />;
                    })()}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {paymentFeaturesTranslated[activeFeature].title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {paymentFeaturesTranslated[activeFeature].description}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-2 mt-8">
                {paymentFeaturesTranslated.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFeature(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeFeature === idx 
                        ? 'bg-[#ff6600] w-8' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {paymentFeaturesTranslated.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  activeFeature === idx 
                    ? 'border-[#ff6600] shadow-2xl' 
                    : 'border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl'
                }`}
                onClick={() => setActiveFeature(idx)}
              >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700`}>
                      {(() => {
                        const Icon = feature.icon as any;
                        return <Icon className={`w-6 h-6 ${feature.color}`} />;
                      })()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-[#13294b] dark:text-white mb-4">
            {t('landing.whyChoose')} <span className="text-[#ff6600]">Moola</span>?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('landing.whyChooseDesc')}
          </p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefitsTranslated.map(({ title, description, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
              className="group relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/5 to-[#13294b]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl w-fit mb-6 group-hover:shadow-lg transition-shadow"
                >
                  <Icon className={`w-8 h-8 ${color}`} />
                </motion.div>
                <h4 className="text-2xl font-bold text-[#13294b] dark:text-white mb-4">
                  {title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Security Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl my-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-[#13294b] dark:text-white mb-4">
            {t('landing.bankLevel')} <span className="text-[#ff6600]">{t('landing.security')}</span>
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('landing.securityDesc')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {securityFeaturesTranslated.map(({ title, description, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 p-4 rounded-2xl w-fit mx-auto mb-6">
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Enhanced Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-[#13294b] dark:text-white mb-4">
            {t('landing.ourServices')} <span className="text-[#ff6600]">{t('landing.services')}</span>
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('landing.servicesDesc')}
          </p>
        </motion.div>

        {/* Enhanced Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-700 shadow-xl mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full lg:max-w-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('landing.searchServices')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all text-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-base font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {(searchTerm || activeCategory !== 'All') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 flex flex-wrap gap-3 items-center"
            >
              <span className="text-gray-600 dark:text-gray-400 font-medium">{t('landing.activeFilters')}:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-4 py-2 rounded-full">
                  {t('landing.search')}: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm px-4 py-2 rounded-full">
                  {t('landing.category')}: {activeCategory}
                  <button onClick={() => setActiveCategory('All')} className="hover:text-green-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-[#ff6600] hover:text-[#e65c00] font-medium transition-colors"
              >
                {t('landing.clearAll')}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Services Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {displayServices.slice(0, 8).map(({ name, icon: Icon, description, category, color }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
              onClick={goToLogin}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ff6600]/10 to-transparent rounded-bl-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-7 h-7 ${color}`} />
                    </div>
                    <span className="bg-[#ff6600]/10 text-[#ff6600] text-xs px-2 py-1 rounded-full font-medium">
                      {category}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#ff6600] transition-colors">
                    {name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        {displayServices.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToLogin}
              className="px-8 py-3 border-2 border-[#13294b] text-[#13294b] dark:border-gray-400 dark:text-gray-300 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {t('landing.viewAll')} {displayServices.length} {t('landing.services')}
            </motion.button>
          </motion.div>
        )}

        {/* No Results State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-500 text-2xl mb-6">
              {t('landing.noServicesFound')}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-8 py-3 bg-[#ff6600] text-white rounded-xl font-semibold hover:bg-[#e65c00] transition shadow-lg"
            >
              {t('landing.showAllServices')}
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* Mobile App Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
              {t('landing.takeXPay')} <span className="text-[#ff6600]">{t('landing.everywhere')}</span>
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {t('landing.mobileAppDesc')}
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {appFeaturesTranslated.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-2 rounded-xl">
                      {(() => {
                        const Icon = feature.icon as any;
                        return <Icon className={`w-5 h-5 ${feature.color}`} />;
                      })()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.title}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition shadow-lg flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                {t('landing.appStore')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                {t('landing.playStore')}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#ff6600] to-[#ff8c00] rounded-3xl p-8 shadow-2xl">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#ff6600] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">{t('landing.xpayWallet')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('landing.readyToUse')}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: Send, label: 'Send Money', color: 'text-green-500' },
                    { icon: Download, label: 'Request Money', color: 'text-blue-500' },
                    { icon: QrCode, label: 'QR Pay', color: 'text-purple-500' },
                    { icon: Receipt, label: 'Bills', color: 'text-orange-500' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
                          {(() => {
                            const Icon = item.icon as any;
                            return <Icon className={`w-5 h-5 ${item.color}`} />;
                          })()}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            {t('landing.whatOurUsers')} <span className="text-[#ff6600]">{t('landing.usersSay')}</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('landing.testimonialsDesc')}
          </p>
        </motion.div>

        <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-2xl">
          <Quote className="absolute top-8 left-8 w-12 h-12 text-[#ff6600]/20" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < testimonials[testimonialIndex].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-white leading-relaxed mb-8">
                  "{testimonials[testimonialIndex].content}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff6600] to-[#ff8c00] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[testimonialIndex].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">
                      {testimonials[testimonialIndex].name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {testimonials[testimonialIndex].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Controls */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-[#13294b] dark:text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAutoPlay(!autoPlay)}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all"
            >
              {autoPlay ? (
                <Pause className="w-5 h-5 text-[#13294b] dark:text-white" />
              ) : (
                <Play className="w-5 h-5 text-[#13294b] dark:text-white" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-[#13294b] dark:text-white" />
            </motion.button>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  testimonialIndex === idx 
                    ? 'bg-[#ff6600] w-8' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Banking Partners Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            {t('landing.trusted')} <span className="text-[#ff6600]">{t('landing.bankingPartners')}</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('landing.bankingPartnersDesc')}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-6xl mx-auto"
        >
          {banksTranslated.map(({ name, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.08, duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
              onClick={goToLogin}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center">
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors">
                  {name}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { number: allServicesTranslated.length + '+', label: t('landing.services'), delay: 0 },
            { number: banksTranslated.length, label: t('landing.bankPartners'), delay: 0.1 },
            { number: '24/7', label: t('landing.available'), delay: 0.2 },
            { number: '100%', label: t('landing.secure'), delay: 0.3 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 text-center transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stat.delay, type: "spring", stiffness: 100 }}
                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ff6600] to-[#ff8c00] bg-clip-text text-transparent mb-4"
              >
                {stat.number}
              </motion.div>
              <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Enhanced Service Request Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            {t('landing.cantFindService')} <span className="text-[#ff6600]">{t('landing.service')}</span>?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('landing.serviceRequestDesc')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleServiceSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <label
              htmlFor="newService"
              className="block text-gray-800 dark:text-gray-200 font-semibold text-lg mb-3"
            >
              {t('landing.serviceName')}
            </label>
            <input
              id="newService"
              type="text"
              placeholder={t('landing.serviceNamePlaceholder')}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition text-lg bg-white dark:bg-gray-800"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8c00] hover:from-[#e65c00] hover:to-[#e65c00] text-white rounded-xl py-4 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t('landing.submitRequest')}
          </motion.button>
          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="mt-6 text-center text-green-600 dark:text-green-400 font-semibold text-lg bg-green-50 dark:bg-green-900/20 py-3 rounded-xl"
              >
                ✅ {t('landing.requestSubmitted')}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </section>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-[#13294b] to-[#1e3a8a] dark:from-gray-900 dark:to-gray-950 text-white py-16 mt-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              {/* Enhanced Footer Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-black tracking-tight leading-none">
                    <span className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] bg-clip-text text-transparent">
                      M
                    </span>
                    <span className="text-white">oola</span>
                  </h1>
                  <p className="text-xs text-gray-300 font-medium tracking-wide mt-1 opacity-80">
                    Premium Solutions
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-lg">
                {t('landing.footerTagline')}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('landing.services')}</h4>
              <div className="space-y-2">
                {[t('landing.billPayments'), t('landing.moneyTransfer'), t('landing.mobileTopup'), t('landing.bankingServices')].map((item) => (
                  <div key={item} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('landing.support')}</h4>
              <div className="space-y-2">
                {[t('landing.helpCenter'), t('landing.contactUs'), t('landing.privacyPolicy'), t('landing.termsOfService')].map((item) => (
                  <div key={item} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('landing.downloadApp')}</h4>
              <div className="space-y-3">
                <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  {t('landing.appStore')}
                </button>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  {t('landing.googlePlay')}
                </button>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-t border-gray-700 pt-8 text-center"
          >
            <p className="text-gray-400 text-lg">
              © {new Date().getFullYear()} Moola. {t('landing.allRightsReserved')}. {t('landing.madeWithLove')}
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}