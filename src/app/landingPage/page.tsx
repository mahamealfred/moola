'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
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
  DollarSign,
  Clock,
  Award,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n-context';
import FlagLanguageSelector from '@/components/FlagLanguageSelector';

// Pie Chart Icon Component
const PieChart = ({ className, color = 'currentColor' }: { className?: string; color?: string }): React.ReactElement => (
  <svg className={className} fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 2.07c3.07.38 5.57 2.52 6.54 5.36L13 9.13V4.07zM4 12c0-4.08 3.06-7.44 7-7.93v15.87c-3.94-.49-7-3.85-7-7.94zm9 7.93V13.9l5.02 5.02c-1.41 1.31-3.27 2.11-5.02 2.01z"/>
  </svg>
);

// Animation Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function LandingPage() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);
  const [newService, setNewService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeBank, setActiveBank] = useState(0);
  const servicesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Enhanced data with more features
  const testimonials = [
    {
      id: 1,
      name: t('landing.testimonial1Name'),
      role: t('landing.testimonial1Role'),
      content: t('landing.testimonial1Content'),
      rating: 5,
      avatar: "AU",
      image: "/avatars/1.jpg"
    },
    {
      id: 2,
      name: t('landing.testimonial2Name'),
      role: t('landing.testimonial2Role'),
      content: t('landing.testimonial2Content'),
      rating: 5,
      avatar: "DM",
      image: "/avatars/2.jpg"
    },
    {
      id: 3,
      name: t('landing.testimonial3Name'),
      role: t('landing.testimonial3Role'),
      content: t('landing.testimonial3Content'),
      rating: 4,
      avatar: "GN",
      image: "/avatars/3.jpg"
    },
    {
      id: 4,
      name: t('landing.testimonial4Name'),
      role: t('landing.testimonial4Role'),
      content: t('landing.testimonial4Content'),
      rating: 5,
      avatar: "EH",
      image: "/avatars/4.jpg"
    }
  ];

  const allServicesTranslated = [
    { name: t('landing.electricityPayment'), icon: Zap, category: 'Utilities', description: t('landing.electricityPaymentDesc'), color: 'text-yellow-500', popularity: 95 },
    { name: t('landing.rraTaxPayment'), icon: FileText, category: 'Government', description: t('landing.rraTaxPaymentDesc'), color: 'text-red-500', popularity: 88 },
    { name: t('landing.buyAirtime'), icon: Phone, category: 'Telecom', description: t('landing.buyAirtimeDesc'), color: 'text-[#ff6600]', popularity: 92 },
    { name: t('landing.startimesTV'), icon: Tv, category: 'Entertainment', description: t('landing.startimesTVDesc'), color: 'text-purple-500', popularity: 78 },
    { name: t('landing.bulkSMS'), icon: MessageSquare, category: 'Communication', description: t('landing.bulkSMSDesc'), color: 'text-blue-500', popularity: 85 },
    { name: t('landing.iremboServices'), icon: Globe, category: 'Government', description: t('landing.iremboServicesDesc'), color: 'text-indigo-500', popularity: 90 },
    { name: t('landing.wasacWater'), icon: Droplet, category: 'Utilities', description: t('landing.wasacWaterDesc'), color: 'text-cyan-500', popularity: 82 },
    { name: t('landing.schoolFees'), icon: BookOpen, category: 'Education', description: t('landing.schoolFeesDesc'), color: 'text-orange-500', popularity: 87 },
    { name: t('landing.bulkSalary'), icon: Users, category: 'Business', description: t('landing.bulkSalaryDesc'), color: 'text-teal-500', popularity: 93 },
    { name: t('landing.invoicePayments'), icon: CreditCard, category: 'Business', description: t('landing.invoicePaymentsDesc'), color: 'text-pink-500', popularity: 89 },
    { name: t('landing.taxCalculation'), icon: Calculator, category: 'Business', description: t('landing.taxCalculationDesc'), color: 'text-gray-600', popularity: 84 },
    { name: t('landing.expenseManagement'), icon: FileSpreadsheet, category: 'Business', description: t('landing.expenseManagementDesc'), color: 'text-amber-600', popularity: 86 }
  ];

  const paymentFeaturesTranslated = [
    {
      title: t('landing.qrCodePayments'),
      description: t('landing.qrCodePaymentsDesc'),
      icon: QrCode,
      color: 'text-[#ff6600]',
      stats: '2M+ Transactions'
    },
    {
      title: t('landing.moneyTransferFeature'),
      description: t('landing.moneyTransferFeatureDesc'),
      icon: Send,
      color: 'text-blue-500',
      stats: 'Instant Processing'
    },
    {
      title: t('landing.billSplitting'),
      description: t('landing.billSplittingDesc'),
      icon: Receipt,
      color: 'text-purple-500',
      stats: 'Group Payments'
    },
    {
      title: t('landing.scheduledPayments'),
      description: t('landing.scheduledPaymentsDesc'),
      icon: Calendar,
      color: 'text-orange-500',
      stats: 'Auto Payments'
    }
  ];

  const securityFeaturesTranslated = [
    {
      title: t('landing.biometricAuth'),
      description: t('landing.biometricAuthDesc'),
      icon: Fingerprint,
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
    { name: t('landing.equityBank'), icon: Building, color: 'text-blue-600', customers: '2M+' },
    { name: t('landing.bankOfKigali'), icon: Building, color: 'text-[#13294b]', customers: '1.5M+' },
    { name: t('landing.ecobank'), icon: Building, color: 'text-orange-600', customers: '1.2M+' },
    { name: t('landing.gtBank'), icon: Building, color: 'text-red-600', customers: '800K+' },
    { name: t('landing.imBank'), icon: Building, color: 'text-purple-600', customers: '900K+' },
    { name: t('landing.cogebank'), icon: Building, color: 'text-teal-600', customers: '700K+' },
  ];

  const benefitsTranslated = [
    { 
      title: t('landing.secureTransactions'), 
      description: t('landing.secureTransactionsDesc'), 
      icon: ShieldIcon,
      color: 'text-[#ff6600]',
      highlight: 'Bank-level encryption'
    },
    { 
      title: t('landing.availability247'), 
      description: t('landing.availability247Desc'), 
      icon: Clock,
      color: 'text-blue-500',
      highlight: 'Always available'
    },
    { 
      title: t('landing.instantProcessing'), 
      description: t('landing.instantProcessingDesc'), 
      icon: ZapIcon,
      color: 'text-purple-500',
      highlight: 'Real-time processing'
    },
    {
      title: t('landing.lowFees'),
      description: t('landing.lowFeesDesc'),
      icon: Banknote,
      color: 'text-[#ff6600]',
      highlight: 'No hidden charges'
    }
  ];

  const appFeaturesTranslated = [
    { title: t('landing.faceID'), icon: Fingerprint, color: 'text-blue-500', description: 'Secure biometric access' },
    { title: t('landing.instantTransfers'), icon: Zap, color: 'text-yellow-500', description: 'Lightning fast transfers' },
    { title: t('landing.billReminders'), icon: Bell, color: 'text-red-500', description: 'Never miss a payment' },
    { title: t('landing.multiCurrency'), icon: DollarSign, color: 'text-[#ff6600]', description: 'Support for 10+ currencies' },
    { title: t('landing.offlineMode'), icon: Wifi, color: 'text-purple-500', description: 'Works without internet' },
    { title: t('landing.analytics'), icon: TrendingUp, color: 'text-orange-500', description: 'Smart spending insights' }
  ];

  // Helper function to translate category names
  const translateCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'All': t('landing.all'),
      'Utilities': t('landing.categoryUtilities'),
      'Government': t('landing.categoryGovernment'),
      'Telecom': t('landing.categoryTelecom'),
      'Entertainment': t('landing.categoryEntertainment'),
      'Communication': t('landing.categoryCommunication'),
      'Business': t('landing.categoryBusiness'),
      'Education': t('landing.categoryEducation'),
    };
    return categoryMap[category] || category;
  };

  // Get unique categories
  const categories = ['All', ...new Set(allServicesTranslated.map(service => service.category))];

  // Enhanced filter with popularity sorting
  const filteredServices = useMemo(() => {
    let filtered = allServicesTranslated;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    // Sort by popularity when searching or filtering
    if (searchTerm || activeCategory !== 'All') {
      filtered = filtered.sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  }, [searchTerm, activeCategory, allServicesTranslated]);

  const displayServices = filteredServices.length > 0 ? filteredServices : allServicesTranslated;

  // Enhanced effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Enhanced auto-rotation with pause on hover
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  // Enhanced features rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % paymentFeaturesTranslated.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [paymentFeaturesTranslated.length]);

  // Enhanced bank partners rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBank((prev) => (prev + 1) % banksTranslated.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banksTranslated.length]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextTheme);
  };

  const goToLogin = () => router.push('/login');
  const goToServices = () => servicesRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.trim().length > 2) {
      setSubmitted(true);
      setNewService('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700 overflow-x-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-br from-[#13294b]/10 to-[#ff6600]/5 dark:from-[#13294b]/20 dark:to-[#ff6600]/10 blur-2xl rounded-full top-8 left-1/4 animate-pulse"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          className="absolute w-36 h-36 sm:w-56 sm:h-56 bg-gradient-to-br from-[#ff6600]/10 to-[#13294b]/5 dark:from-[#ff6600]/20 dark:to-[#13294b]/10 blur-xl rounded-full bottom-8 right-1/4 animate-pulse"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/5 dark:bg-purple-500/10 blur-2xl rounded-full top-1/2 left-4 sm:left-8 animate-pulse"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Enhanced Sticky Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-md' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-1 sm:gap-2"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 border border-white/20">
                  <span className="text-white font-black text-base sm:text-lg tracking-tighter drop-shadow">M</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-lg sm:rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-500 -z-10" />
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-[#ff6600] via-[#ff7700] to-[#ff8533] bg-clip-text text-transparent drop-shadow-sm">
                    M
                  </span>
                  <span className="text-[#13294b] dark:text-white drop-shadow-sm">oola</span>
                </h1>
                <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium tracking-wider mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  {t('landing.premiumSolutions')}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Navigation */}
          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex items-center gap-4"
          >
            {[
              { key: 'services', label: t('landing.navServices') },
              { key: 'features', label: t('landing.navFeatures') },
              { key: 'security', label: t('landing.navSecurity') },
              { key: 'testimonials', label: t('landing.navTestimonials') }
            ].map((item) => (
              <motion.button
                key={item.key}
                whileHover={{ scale: 1.05, color: '#ff6600' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.key)}
                className="text-[#13294b] dark:text-gray-300 font-medium hover:text-[#ff6600] dark:hover:text-[#ff6600] transition-colors text-sm"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-1 sm:gap-2"
          >
            <FlagLanguageSelector />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Toggle Light/Dark Mode"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800" />
              )}
            </motion.button>
            
            {/* Enhanced CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToLogin}
              className="hidden sm:block px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md text-sm"
            >
              {t('landing.signIn')}
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative text-center pt-8 sm:pt-16 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/4 left-1/4 w-24 h-24 bg-[#ff6600]/10 rounded-full blur-lg"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#13294b]/10 rounded-full blur-lg"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center bg-gradient-to-r from-[#ff6600]/10 to-[#13294b]/10 dark:from-[#ff6600]/20 dark:to-[#13294b]/20 text-[#ff6600] dark:text-[#ffcc99] px-3 py-1.5 rounded-full text-xs font-medium mb-4 sm:mb-6 border border-[#ff6600]/20 backdrop-blur-sm"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {t('landing.leadingPlatform')}
          <Award className="w-3 h-3 ml-1" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4 leading-tight"
        >
          {t('landing.heroTitle')}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="block bg-gradient-to-r from-[#ff6600] via-[#ff8c00] to-[#ff6600] bg-clip-text text-transparent bg-size-200 animate-gradient"
          >
            {t('landing.paymentSolution')}
          </motion.span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-3"
        >
          {t('landing.heroDescription')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-3"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link
              href="/registration"
              className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:shadow-[#ff6600]/25 flex items-center justify-center gap-2 text-sm w-full sm:w-auto group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {t('landing.getStarted')} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={goToServices}
              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-[#13294b] text-[#13294b] dark:border-gray-400 dark:text-gray-300 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm w-full sm:w-auto text-center group"
            >
              <span className="flex items-center justify-center gap-1">
                {t('landing.exploreServices')} <GlobeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 px-3"
        >
          {[
            { number: '500K+', label: t('landing.happyUsers'), icon: Users },
            { number: '1.2M+', label: t('landing.transactions'), icon: TrendingUp },
            { number: '99.9%', label: t('landing.uptime'), icon: Zap },
            { number: '50+', label: t('landing.services'), icon: ShoppingCart }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -3 }}
              className="text-center group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300">
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 p-2 rounded-lg w-fit mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6600]" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#ff6600] mb-1">{stat.number}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enhanced Services Section */}
      <section id="services" ref={servicesRef} className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1 text-[#ff6600] mb-3"
          >
            <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-pulse" />
          </motion.div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.ourServices')} <span className="text-[#ff6600]">{t('landing.services')}</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 leading-relaxed">
            {t('landing.servicesDesc')}
          </p>
        </motion.div>

        {/* Advanced Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg mb-6 sm:mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder={t('landing.searchServices')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent transition-all text-sm sm:text-base shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center w-full lg:w-auto">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative overflow-hidden group ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  <span className="relative z-10">{translateCategory(category)}</span>
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || activeCategory !== 'All') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 items-center"
            >
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">{t('landing.activeFilters')}:</span>
              {searchTerm && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full shadow-sm"
                >
                  {t('landing.search')}: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {activeCategory !== 'All' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1 bg-[#ff6600]/10 dark:bg-[#ff6600]/20 text-[#ff6600] dark:text-[#ff8533] text-xs px-2 py-1 rounded-full shadow-sm"
                >
                  {t('landing.category')}: {translateCategory(activeCategory)}
                  <button onClick={() => setActiveCategory('All')} className="hover:text-[#ff8533] transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-xs text-[#ff6600] hover:text-[#e65c00] font-medium transition-colors flex items-center gap-1"
              >
                {t('landing.clearAll')}
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Services Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {displayServices.slice(0, isMobile ? 6 : 12).map(({ name, icon: Icon, description, category, color, popularity }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -3, transition: { duration: 0.2 } }}
              onClick={goToLogin}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#ff6600]/10 to-transparent rounded-bl-xl" />
                
                {/* Popularity Badge */}
                <div className="absolute top-2 left-2 bg-[#ff6600] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  {popularity}% {t('landing.popular')}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
                    </div>
                    <span className="bg-[#ff6600]/10 text-[#ff6600] text-xs px-2 py-1 rounded-full font-medium">
                      {translateCategory(category)}
                    </span>
                  </div>
                  
                  <h4 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1.5 group-hover:text-[#ff6600] transition-colors">
                    {name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced View More Button */}
        {displayServices.length > (isMobile ? 6 : 12) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 sm:mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToLogin}
              className="px-6 sm:px-8 py-2.5 sm:py-3 border border-[#13294b] text-[#13294b] dark:border-gray-400 dark:text-gray-300 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm group"
            >
              <span className="flex items-center justify-center gap-2">
                {t('landing.viewAll')} {displayServices.length} {t('landing.services')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced No Results State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                {t('landing.noServicesFound')}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
                We couldn't find any services matching your criteria. Try adjusting your search or filters.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md text-sm"
              >
                {t('landing.showAllServices')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Enhanced Payment Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl my-6 sm:my-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.smartPayment')} <span className="text-[#ff6600]">{t('landing.paymentFeatures')}</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3">
            {t('landing.paymentFeaturesDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Animated Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-4 sm:p-5 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-md`}>
                    {(() => {
                      const Icon = paymentFeaturesTranslated[activeFeature].icon as any;
                      return <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${paymentFeaturesTranslated[activeFeature].color}`} />;
                    })()}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    {paymentFeaturesTranslated[activeFeature].title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-base mb-3">
                    {paymentFeaturesTranslated[activeFeature].description}
                  </p>
                  <div className="text-[#ff6600] font-semibold text-sm">
                    {paymentFeaturesTranslated[activeFeature].stats}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-2 mt-6">
                {paymentFeaturesTranslated.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFeature(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeFeature === idx 
                        ? 'bg-[#ff6600] w-6' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {paymentFeaturesTranslated.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -3 }}
                className={`bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer group ${
                  activeFeature === idx 
                    ? 'border-[#ff6600] shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg'
                }`}
                onClick={() => setActiveFeature(idx)}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 group-hover:scale-110 transition-transform duration-300 ${
                    activeFeature === idx ? 'ring-1 ring-[#ff6600]' : ''
                  }`}>
                    {(() => {
                      const Icon = feature.icon as any;
                      return <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-base sm:text-lg mb-1.5">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      {feature.description}
                    </p>
                    <div className="text-[#ff6600] font-medium text-xs mt-1.5">
                      {feature.stats}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.whyChoose')} <span className="text-[#ff6600]">Moola</span>?
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3">
            {t('landing.whyChooseDesc')}
          </p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {benefitsTranslated.map(({ title, description, icon: Icon, color, highlight }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
              className="group relative bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/5 to-[#13294b]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg w-fit mb-4 group-hover:shadow-md transition-shadow"
                >
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
                </motion.div>
                <h4 className="text-lg sm:text-xl font-bold text-[#13294b] dark:text-white mb-2 sm:mb-3">
                  {title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                  {description}
                </p>
                <div className="text-[#ff6600] font-semibold text-xs sm:text-sm">
                  {highlight}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Enhanced Security Section */}
      <section id="security" className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl my-6 sm:my-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.bankLevel')} <span className="text-[#ff6600]">{t('landing.security')}</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3">
            {t('landing.securityDesc')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {securityFeaturesTranslated.map(({ title, description, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -3, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
                {title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#ff6600]/10 text-[#ff6600] dark:text-[#ff8533] px-4 py-2 rounded-full border border-[#ff6600]/20 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">ISO 27001 Certified & PCI DSS Compliant</span>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Mobile App Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
              {t('landing.takeXPay')} <span className="text-[#ff6600]">{t('landing.everywhere')}</span>
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              {t('landing.mobileAppDesc')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {appFeaturesTranslated.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 p-1.5 sm:p-2 rounded-md group-hover:scale-110 transition-transform duration-300">
                    {(() => {
                      const Icon = feature.icon as any;
                      return <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`} />;
                    })()}
                  </div>
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 font-medium text-sm">{feature.title}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm group"
              >
                <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('landing.appStore')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-lg font-semibold hover:shadow-lg transition shadow-md flex items-center justify-center gap-2 text-sm group"
              >
                <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('landing.playStore')}
              </motion.button>
            </div>

            {/* App Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 sm:gap-6 mt-6 sm:mt-8"
            >
              {[
                { number: '4.9', label: 'App Store' },
                { number: '4.8', label: 'Play Store' },
                { number: '500K+', label: 'Downloads' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#ff6600]">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-gradient-to-br from-[#ff6600] to-[#ff8c00] rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full animate-pulse" />
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/20 rounded-full animate-pulse" />
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-md relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ff6600] rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-base sm:text-lg">M</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white text-base sm:text-lg">{t('landing.xpayWallet')}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">{t('landing.readyToUse')}</div>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { icon: Send, label: 'Send Money', color: 'text-[#ff6600]', amount: '+$2,500' },
                    { icon: Download, label: 'Request Money', color: 'text-blue-500', amount: '+$1,200' },
                    { icon: QrCode, label: 'QR Pay', color: 'text-purple-500', amount: '15+ Scans' },
                    { icon: Receipt, label: 'Bills', color: 'text-orange-500', amount: '3 Paid' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 dark:bg-gray-600 p-1 rounded-md group-hover:scale-110 transition-transform duration-300">
                          {(() => {
                            const Icon = item.icon as any;
                            return <Icon className={`w-4 h-4 ${item.color}`} />;
                          })()}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{item.label}</span>
                      </div>
                      <span className="text-[#ff6600] font-semibold text-xs">{item.amount}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.whatOurUsers')} <span className="text-[#ff6600]">{t('landing.usersSay')}</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3">
            {t('landing.testimonialsDesc')}
          </p>
        </motion.div>

        <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <Quote className="absolute top-3 sm:top-4 left-3 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 text-[#ff6600]/20" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
                onHoverStart={() => setAutoPlay(false)}
                onHoverEnd={() => setAutoPlay(true)}
              >
                <div className="flex justify-center mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 mx-0.5 ${
                        i < testimonials[testimonialIndex].rating
                          ? 'text-yellow-400 fill-current animate-pulse'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-lg sm:text-xl lg:text-2xl font-light text-gray-800 dark:text-white leading-relaxed mb-4 sm:mb-6 px-3">
                  "{testimonials[testimonialIndex].content}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#ff6600] to-[#ff8c00] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
                    {testimonials[testimonialIndex].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                      {testimonials[testimonialIndex].name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonials[testimonialIndex].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Testimonial Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-2 sm:p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-[#13294b] dark:text-white group-hover:text-[#ff6600] transition-colors" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAutoPlay(!autoPlay)}
              className="p-2 sm:p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all group"
            >
              {autoPlay ? (
                <Pause className="w-4 h-4 text-[#13294b] dark:text-white group-hover:text-[#ff6600] transition-colors" />
              ) : (
                <Play className="w-4 h-4 text-[#13294b] dark:text-white group-hover:text-[#ff6600] transition-colors" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-2 sm:p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <ChevronRight className="w-4 h-4 text-[#13294b] dark:text-white group-hover:text-[#ff6600] transition-colors" />
            </motion.button>
          </div>

          {/* Enhanced Testimonial Indicators */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  testimonialIndex === idx 
                    ? 'bg-[#ff6600] w-6 shadow-md' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Banking Partners Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.trusted')} <span className="text-[#ff6600]">{t('landing.bankingPartners')}</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3">
            {t('landing.bankingPartnersDesc')}
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto"
          >
            {banksTranslated.map(({ name, icon: Icon, color, customers }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.08, duration: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -3, transition: { duration: 0.2 } }}
                onClick={goToLogin}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-500 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-2 sm:p-3 rounded-lg w-fit mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white group-hover:text-[#ff6600] transition-colors mb-1">
                      {name}
                    </h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {customers} customers
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Partner Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 sm:mt-12"
          >
            <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              {[
                { number: '6+', label: 'Bank Partners' },
                { number: '5M+', label: 'Joint Customers' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-[#ff6600]">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { number: allServicesTranslated.length + '+', label: t('landing.services'), delay: 0, icon: Zap },
            { number: banksTranslated.length, label: t('landing.bankPartners'), delay: 0.1, icon: Building },
            { number: '24/7', label: t('landing.available'), delay: 0.2, icon: Clock },
            { number: '100%', label: t('landing.secure'), delay: 0.3, icon: ShieldCheck }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -3, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 text-center transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-2 sm:p-3 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6600]" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stat.delay, type: "spring", stiffness: 100 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#ff6600] to-[#ff8c00] bg-clip-text text-transparent mb-1.5 sm:mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Enhanced Service Request Section */}
      <section className="max-w-3xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13294b] dark:text-white mb-3 sm:mb-4">
            {t('landing.cantFindService')} <span className="text-[#ff6600]">{t('landing.service')}</span>?
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-3">
            {t('landing.serviceRequestDesc')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleServiceSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
        >
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="newService"
              className="block text-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg mb-2"
            >
              {t('landing.serviceName')}
            </label>
            <input
              id="newService"
              type="text"
              placeholder={t('landing.serviceNamePlaceholder')}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition text-sm sm:text-base bg-white dark:bg-gray-800 shadow-inner"
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
            className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8c00] hover:from-[#e65c00] hover:to-[#e65c00] text-white rounded-lg py-2.5 font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10">{t('landing.submitRequest')}</span>
          </motion.button>
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="mt-4 sm:mt-6 text-center text-[#ff6600] dark:text-[#ff8533] font-semibold text-sm bg-[#ff6600]/10 dark:bg-[#ff6600]/20 py-2.5 rounded-lg border border-[#ff6600]/20 dark:border-[#ff6600]/30"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {t('landing.requestSubmitted')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </section>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-[#13294b] to-[#1e3a8a] dark:from-gray-900 dark:to-gray-950 text-white py-12 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              {/* Enhanced Footer Logo */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-base">M</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-black tracking-tight leading-none">
                    <span className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] bg-clip-text text-transparent">
                      M
                    </span>
                    <span className="text-white">oola</span>
                  </h1>
                  <p className="text-[10px] text-gray-300 font-medium tracking-wide mt-0.5 opacity-80">
                    {t('landing.premiumSolutions')}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('landing.footerTagline')}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map((social) => (
                  <motion.button
                    key={social}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <span className="text-white text-xs font-medium">{social[0]}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-base font-semibold mb-3">{t('landing.services')}</h4>
              <div className="space-y-1.5">
                {[t('landing.billPayments'), t('landing.moneyTransfer'), t('landing.mobileTopup'), t('landing.bankingServices'), 'Investment', 'Insurance'].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 3, color: '#ff6600' }}
                    className="text-gray-300 hover:text-[#ff6600] transition-colors cursor-pointer text-xs"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-base font-semibold mb-3">{t('landing.support')}</h4>
              <div className="space-y-1.5">
                {[t('landing.helpCenter'), t('landing.contactUs'), t('landing.privacyPolicy'), t('landing.termsOfService'), 'API Documentation', 'Developer Resources'].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 3, color: '#ff6600' }}
                    className="text-gray-300 hover:text-[#ff6600] transition-colors cursor-pointer text-xs"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-base font-semibold mb-3">{t('landing.downloadApp')}</h4>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {t('landing.appStore')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {t('landing.googlePlay')}
                </motion.button>
              </div>

              {/* Newsletter Subscription */}
              <div className="mt-4">
                <p className="text-gray-300 text-xs mb-2">Subscribe to our newsletter</p>
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-md px-2 py-1.5 text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff6600]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#ff6600] text-white px-3 py-1.5 rounded-md font-medium text-xs hover:bg-[#e65c00] transition-colors"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-t border-gray-700 pt-6 text-center"
          >
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Moola. {t('landing.allRightsReserved')}. {t('landing.madeWithLove')}
            </p>
            <div className="flex justify-center gap-4 mt-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                <button key={item} className="text-gray-400 hover:text-white text-xs transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}