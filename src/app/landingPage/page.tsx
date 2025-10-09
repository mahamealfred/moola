'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, Variants, easeOut, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, X, Quote, Download, Upload, Smartphone, Laptop, Wifi, Home, Car, Heart, ShoppingCart, Coffee, Plane, GraduationCap, Gift } from 'lucide-react';
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
  Landmark,
  ShieldCheck,
  Sparkles,
  Star,
  Play,
  Pause,
  Lock,
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  Wallet,
  QrCode,
  Send,
  Receipt,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Alice Uwase",
    role: "Small Business Owner",
    content: "X-Pay has transformed how I manage my business payments. The bulk salary feature saves me hours every month!",
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
    content: "I use X-Pay for all my utility payments and tax calculations. It's reliable and saves me so much time.",
    rating: 5,
    avatar: "EH"
  }
];

// All Services Data with consistent icon colors
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

// New Payment Features
const paymentFeatures = [
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
const securityFeatures = [
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
];

// Banks
const banks = [
  { name: 'Equity Bank', icon: Building, color: 'text-blue-600' },
  { name: 'Bank of Kigali', icon: Building, color: 'text-green-600' },
  { name: 'Ecobank', icon: Building, color: 'text-orange-600' },
  { name: 'GT Bank', icon: Building, color: 'text-red-600' },
  { name: 'I&M Bank', icon: Building, color: 'text-purple-600' },
  { name: 'Cogebank', icon: Building, color: 'text-teal-600' },
];

// Benefits
const benefits = [
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
];

// Pie Chart Icon Component (typed and hoisted before usage)
const PieChart = ({ className, color = 'currentColor' }: { className?: string; color?: string }): React.ReactElement => (
  <svg className={className} fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 2.07c3.07.38 5.57 2.52 6.54 5.36L13 9.13V4.07zM4 12c0-4.08 3.06-7.44 7-7.93v15.87c-3.94-.49-7-3.85-7-7.94zm9 7.93V13.9l5.02 5.02c-1.41 1.31-3.27 2.11-5.02 2.01z"/>
  </svg>
);

// Mobile App Features
const appFeatures = [
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
];

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

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut }
  }
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOut }
  }
};

// Pie Chart Icon Component
// ...existing code...

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [newService, setNewService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();

  const itemsPerView = 3;

  // Get unique categories
  const categories = ['All', ...new Set(allServices.map(service => service.category))];

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = allServices;

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
  }, [searchTerm, activeCategory]);

  // Update carousel to use filtered services
  const displayServices = filteredServices.length > 0 ? filteredServices : allServices;

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
      setActiveFeature((prev) => (prev + 1) % paymentFeatures.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#ff6600] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {/* <span className="text-[#ff6600]">X</span> */}
              <span className="text-[#13294b] dark:text-white">-Pay</span>
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="text-[#13294b] dark:text-white font-medium hover:text-[#ff6600] dark:hover:text-[#ff6600] transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Login
            </Link>
          </motion.div>
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
        </div>
      </motion.header>

      {/* Enhanced Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center bg-gradient-to-r from-[#ff6600]/10 to-[#13294b]/10 dark:from-[#ff6600]/20 dark:to-[#13294b]/20 text-[#ff6600] dark:text-[#ffcc99] px-6 py-3 rounded-full text-sm font-medium mb-8 border border-[#ff6600]/20"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Rwanda's Leading Payment Platform
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#13294b] dark:text-white mb-8 leading-tight"
        >
          Your All-in-One
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="block bg-gradient-to-r from-[#ff6600] to-[#ff8c00] bg-clip-text text-transparent"
          >
            Payment Solution
          </motion.span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl sm:text-2xl max-w-4xl mx-auto text-gray-700 dark:text-gray-300 mb-12 leading-relaxed"
        >
          Send money, pay bills, manage expenses, and grow your business with Rwanda's most comprehensive digital payment platform.
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
              className="px-10 py-4 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 shadow-lg hover:shadow-[#ff6600]/25 flex items-center justify-center gap-3 text-lg"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="px-10 py-4 border-2 border-[#13294b] text-[#13294b] dark:border-gray-400 dark:text-gray-300 rounded-2xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          {[
            { number: '50K+', label: 'Happy Users' },
            { number: '1M+', label: 'Transactions' },
            { number: '99.9%', label: 'Uptime' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-[#ff6600]">{stat.number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Payment Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            Smart <span className="text-[#ff6600]">Payment Features</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to manage your money efficiently and securely
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
                      const Icon = paymentFeatures[activeFeature].icon as any;
                      return <Icon className={`w-10 h-10 ${paymentFeatures[activeFeature].color}`} />;
                    })()}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {paymentFeatures[activeFeature].title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {paymentFeatures[activeFeature].description}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-2 mt-8">
                {paymentFeatures.map((_, idx) => (
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
            {paymentFeatures.map((feature, idx) => (
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
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            Why Choose <span className="text-[#ff6600]">X-Pay</span>?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the future of digital payments with our cutting-edge platform
          </p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map(({ title, description, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-500"
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
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl my-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            Bank-Level <span className="text-[#ff6600]">Security</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your security is our top priority. We use enterprise-grade encryption to protect your data.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {securityFeatures.map(({ title, description, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
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
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            Our <span className="text-[#ff6600]">Services</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Access a comprehensive range of financial and utility services through our secure platform
          </p>
        </motion.div>

        {/* Enhanced Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full lg:max-w-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
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
              <span className="text-gray-600 dark:text-gray-400 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-4 py-2 rounded-full">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm px-4 py-2 rounded-full">
                  Category: {activeCategory}
                  <button onClick={() => setActiveCategory('All')} className="hover:text-green-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-[#ff6600] hover:text-[#e65c00] font-medium transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayServices.slice(0, 8).map(({ name, icon: Icon, description, category, color }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
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
        </div>

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
              View All {displayServices.length} Services
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
              No services found matching your criteria
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-8 py-3 bg-[#ff6600] text-white rounded-xl font-semibold hover:bg-[#e65c00] transition shadow-lg"
            >
              Show all services
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* Mobile App Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
              Take X-Pay <span className="text-[#ff6600]">Everywhere</span>
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Download our mobile app and manage your payments on the go. Available on iOS and Android.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {appFeatures.map((feature, idx) => (
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
                App Store
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Play Store
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
                    <span className="text-white font-bold">X</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">X-Pay Wallet</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ready to use</div>
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
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            What Our <span className="text-[#ff6600]">Users Say</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover why thousands of users trust X-Pay for their payment needs
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
            Trusted <span className="text-[#ff6600]">Banking Partners</span>
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We partner with leading financial institutions to bring you seamless banking services
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-6xl mx-auto"
        >
          {banks.map(({ name, icon: Icon, color }, idx) => (
            <motion.div
              key={idx}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -5 }}
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
            { number: allServices.length + '+', label: 'Services', delay: 0 },
            { number: banks.length, label: 'Bank Partners', delay: 0.1 },
            { number: '24/7', label: 'Available', delay: 0.2 },
            { number: '100%', label: 'Secure', delay: 0.3 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 text-center transition-all duration-500"
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
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h3 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6">
            Can't Find Your <span className="text-[#ff6600]">Service</span>?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Let us know what service you need, and we'll consider adding it to our platform.
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
              Service Name
            </label>
            <input
              id="newService"
              type="text"
              placeholder="Enter service name (e.g., Water Bill)"
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
            Submit Request
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
                ✅ Thank you! Your request has been submitted.
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#ff6600] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">X</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  <span className="text-[#ff6600]">X</span>
                  <span className="text-white">-Pay</span>
                </h1>
              </div>
              <p className="text-gray-300 text-lg">
                Simplifying digital payments in Rwanda with cutting-edge technology and unparalleled security.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                {['Bill Payments', 'Money Transfer', 'Mobile Top-up', 'Banking Services'].map((item) => (
                  <div key={item} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <div key={item} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Download App</h4>
              <div className="space-y-3">
                <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  App Store
                </button>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Google Play
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
              © {new Date().getFullYear()} X-Pay. All rights reserved. Made with ❤️ for Rwanda
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}