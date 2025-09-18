'use client';

import { useEffect, useState } from 'react';
import { motion, Variants, easeOut } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Features
const features = [
  { name: 'Electricity Payment', icon: Zap, description: 'Pay electricity bills instantly' },
  { name: 'RRA Tax Payment', icon: FileText, description: 'Handle tax payments efficiently' },
  { name: 'Buy Airtime', icon: Phone, description: 'Top up any mobile network' },
  { name: 'Startimes TV', icon: Tv, description: 'Subscribe to TV packages' },
  { name: 'Bulk SMS', icon: MessageSquare, description: 'Send messages to multiple recipients' },
  { name: 'Irembo Services', icon: Globe, description: 'Access government services' },
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
  const router = useRouter();

  const itemsPerView = 3; // number of services visible at once

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

  // Navigate to login on clicking any service/bank
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
      prev + itemsPerView >= features.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev - itemsPerView < 0
        ? Math.max(features.length - itemsPerView, 0)
        : prev - itemsPerView
    );
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#13294b] dark:text-white mb-8">
          Our Services
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Access a wide range of financial and utility services through our secure platform
        </p>

        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 md:-left-8 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <ChevronLeft className="w-5 h-5 text-[#13294b] dark:text-white" />
          </button>

          {/* Cards Container */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-center gap-6 overflow-hidden"
          >
            {features
              .slice(current, current + itemsPerView)
              .map(({ name, icon: Icon, description }, idx) => (
                <motion.button
                  key={idx}
                  onClick={goToLogin}
                  whileHover={{ scale: 1.03 }}
                  className="w-64 flex flex-col items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                >
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
          <button
            onClick={nextSlide}
            className="absolute -right-4 md:-right-8 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-[#13294b] dark:text-white" />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(features.length / itemsPerView) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx * itemsPerView)}
              className={`w-2 h-2 rounded-full mx-1 ${
                current === idx * itemsPerView ? 'bg-[#ff6600]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
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
            <span className="text-[#13294b] dark:text-white">-Pay</span>
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