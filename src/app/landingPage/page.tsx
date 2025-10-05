'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, Variants, easeOut } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, X } from 'lucide-react';
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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// All Services Data
const allServices = [
  { name: 'Electricity Payment', icon: Zap, category: 'Utilities', description: 'Pay electricity bills instantly' },
  { name: 'RRA Tax Payment', icon: FileText, category: 'Government', description: 'Handle tax payments efficiently' },
  { name: 'Buy Airtime', icon: Phone, category: 'Telecom', description: 'Top up any mobile network' },
  { name: 'Startimes TV', icon: Tv, category: 'Entertainment', description: 'Subscribe to TV packages' },
  { name: 'Bulk SMS', icon: MessageSquare, category: 'Communication', description: 'Send messages to multiple recipients' },
  { name: 'Irembo Services', icon: Globe, category: 'Government', description: 'Access government services' },
  { name: 'WASAC Water', icon: Droplet, category: 'Utilities', description: 'Pay water bills online' },
  { name: 'School Fees', icon: BookOpen, category: 'Education', description: 'Education fee payments' },
  { name: 'Bulk Salary', icon: Users, category: 'Business', description: 'Manage payroll payments' },
  { name: 'Invoice Payments', icon: CreditCard, category: 'Business', description: 'Handle invoice processing' },
  { name: 'Tax Calculation', icon: Calculator, category: 'Business', description: 'Automated tax calculations' },
  { name: 'Expense Management', icon: FileSpreadsheet, category: 'Business', description: 'Track business expenses' },
];

// Banks
const banks = [
  { name: 'Equity Bank', icon: Building },
  { name: 'Bank of Kigali', icon: Building },
  { name: 'Ecobank', icon: Building },
  { name: 'GT Bank', icon: Building },
];

// Benefits
const benefits = [
  { title: 'Secure Transactions', description: 'Bank-level security for all your payments', icon: Shield },
  { title: '24/7 Availability', description: 'Access services anytime, anywhere', icon: Users },
  { title: 'Instant Processing', description: 'No delays in transaction processing', icon: CheckCircle },
];

// Animation Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
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
  const [isDark, setIsDark] = useState(true);
  const [newService, setNewService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
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

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700 overflow-x-hidden">
      {/* Floating blurred background accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#13294b]/10 dark:bg-[#13294b]/20 blur-3xl rounded-full top-10 left-1/4" />
        <div className="absolute w-64 h-64 bg-[#ff6600]/10 dark:bg-[#ff6600]/20 blur-2xl rounded-full bottom-10 right-1/4" />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-[#ff6600]">X</span>
            <span className="text-[#13294b] dark:text-white">-Pay</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[#13294b] dark:text-white font-medium hover:text-[#ff6600] dark:hover:text-[#ff6600] transition-colors"
          >
            Login
          </Link>
          <button
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
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center bg-[#ff6600]/10 dark:bg-[#ff6600]/20 text-[#ff6600] dark:text-[#ffcc99] px-4 py-2 rounded-full text-sm font-medium mb-6">
          Rwanda's Leading Payment Platform
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-[#13294b] dark:text-white mb-6 leading-tight">
          Simplifying Digital Payments
        </h2>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-10">
          X-Pay empowers businesses and individuals with a secure, efficient platform for all your payment needs. 
          From utility bills to banking services, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/registration"
            className="px-8 py-3 bg-[#ff6600] text-white rounded-xl font-semibold hover:bg-[#e65c00] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-[#13294b] text-[#13294b] dark:border-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#13294b] dark:text-white mb-12">
          Why Choose X-Pay?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map(({ title, description, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-[#13294b]/10 dark:bg-[#13294b]/20 p-3 rounded-lg w-fit mb-4">
                <Icon className="w-6 h-6 text-[#13294b] dark:text-[#ff6600]" />
              </div>
              <h4 className="text-lg font-semibold text-[#13294b] dark:text-white mb-2">
                {title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section with Advanced Filters */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#13294b] dark:text-white mb-4">
            All Services
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access a comprehensive range of financial and utility services through our secure platform
          </p>
        </div>

        {/* Advanced Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg mb-8"
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
            <div className="flex flex-wrap gap-2 justify-center">
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
          </div>

          {/* Active Filters Display */}
          {(searchTerm || activeCategory !== 'All') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap gap-2 items-center"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
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
              <button
                onClick={clearFilters}
                className="text-sm text-[#ff6600] hover:text-[#e65c00] font-medium ml-2"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Services Carousel */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          {displayServices.length > itemsPerView && (
            <button
              onClick={prevSlide}
              className="absolute -left-4 md:-left-8 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="w-5 h-5 text-[#13294b] dark:text-white" />
            </button>
          )}

          {/* Services Grid */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-center gap-6 overflow-hidden"
          >
            {displayServices
              .slice(current, current + itemsPerView)
              .map(({ name, icon: Icon, description, category }, idx) => (
                <motion.button
                  key={`${name}-${idx}`}
                  onClick={goToLogin}
                  whileHover={{ scale: 1.03 }}
                  className="w-64 flex flex-col items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer relative"
                >
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#ff6600]/10 text-[#ff6600] text-xs px-2 py-1 rounded-full font-medium">
                      {category}
                    </span>
                  </div>

                  <div className="bg-[#13294b]/10 dark:bg-[#13294b]/20 p-3 rounded-lg mb-4">
                    <Icon className="w-8 h-8 text-[#13294b] dark:text-[#ff6600]" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">
                    {name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {description}
                  </p>
                </motion.button>
              ))}
          </motion.div>

          {/* Right Arrow */}
          {displayServices.length > itemsPerView && (
            <button
              onClick={nextSlide}
              className="absolute -right-4 md:-right-8 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="w-5 h-5 text-[#13294b] dark:text-white" />
            </button>
          )}
        </div>

        {/* Carousel Indicators */}
        {displayServices.length > itemsPerView && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: Math.ceil(displayServices.length / itemsPerView) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx * itemsPerView)}
                className={`w-2 h-2 rounded-full mx-1 ${
                  current === idx * itemsPerView ? 'bg-[#ff6600]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Services Count */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Showing {Math.min(displayServices.length, itemsPerView)} of {displayServices.length} services
            {filteredServices.length !== allServices.length && ` (filtered from ${allServices.length} total)`}
          </p>
        </div>

        {/* No Results State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-4">
              No services found matching your criteria
            </div>
            <button
              onClick={clearFilters}
              className="text-[#ff6600] hover:text-[#e65c00] font-medium"
            >
              Show all services
            </button>
          </motion.div>
        )}
      </section>

      {/* Agency Banking Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#13294b] dark:text-white mb-8">
          Banking Partners
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          We partner with leading financial institutions to bring you seamless banking services
        </p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {banks.map(({ name, icon: Icon }, idx) => (
            <motion.button
              key={idx}
              variants={fadeUp}
              onClick={goToLogin}
              className="flex flex-col items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="bg-[#ff6600]/10 dark:bg-[#ff6600]/20 p-2 rounded-lg mb-3">
                <Icon className="w-8 h-8 text-[#ff6600]" />
              </div>
              <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                {name}
              </h4>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6600] mb-2">
              {allServices.length}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Services</div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6600] mb-2">
              {banks.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bank Partners</div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6600] mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6600] mb-2">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Secure</div>
          </motion.div>
        </div>
      </section>

      {/* Add More Service Form Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#13294b] dark:text-white mb-6">
          Request a Service
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Can't find what you're looking for? Let us know and we'll consider adding it to our platform.
        </p>

        <motion.form
          onSubmit={handleServiceSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md max-w-lg mx-auto border border-gray-100 dark:border-gray-800"
        >
          <label
            htmlFor="newService"
            className="block text-gray-800 dark:text-gray-200 font-medium mb-2"
          >
            Service Name
          </label>
          <input
            id="newService"
            type="text"
            placeholder="Enter service name (e.g., Water Bill)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 mb-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition bg-white dark:bg-gray-800"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            required
            minLength={3}
          />
          <button
            type="submit"
            className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-xl py-2.5 font-medium transition shadow-md hover:shadow-lg"
          >
            Submit Request
          </button>
          {submitted && (
            <p
              role="alert"
              className="mt-4 text-center text-green-600 dark:text-green-400 font-medium text-sm"
            >
              ✅ Thank you! Your request has been submitted.
            </p>
          )}
        </motion.form>
      </section>

      {/* Footer */}
      <footer className="bg-[#13294b] dark:bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span className="text-[#ff6600]">X</span>
                  <span className="text-white">-Pay</span>
                </h1>
              </div>
              <p className="text-gray-400 mt-2">Simplifying digital payments in Rwanda</p>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-white transition">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">Privacy</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} X-Pay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}