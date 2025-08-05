'use client';

import { useEffect, useState } from 'react';
import { motion, Variants, easeOut } from 'framer-motion';
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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
  { name: 'Electricity Payment', icon: Zap },
  { name: 'RRA Tax Payment', icon: FileText },
  { name: 'Buy Airtime', icon: Phone },
  { name: 'Startimes TV', icon: Tv },
  { name: 'Bulk SMS', icon: MessageSquare },
  { name: 'Irembo Pay', icon: Globe },
];

const banks = [
  { name: 'Equity Bank', icon: Building },
  { name: 'BK', icon: Building },
  { name: 'Ecobank', icon: Building },
  { name: 'GT Bank', icon: Building },
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
  const router = useRouter();

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
      // Simulate submission, you can replace with API call
      setSubmitted(true);
      setNewService('');
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      alert('Please enter a valid service name');
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700 overflow-x-hidden">
      {/* Floating blurred background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-300/30 dark:bg-blue-900/30 blur-3xl rounded-full top-10 left-1/4 animate-pulse" />
        <div className="absolute w-64 h-64 bg-purple-300/20 dark:bg-purple-800/20 blur-2xl rounded-full bottom-10 right-1/4 animate-ping" />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white select-none tracking-tight">
          X-pay
        </h1>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Toggle Light/Dark Mode"
        >
          {isDark ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </header>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 select-none leading-tight">
          Powering Everyday Services
        </h2>
        <p className="text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-12 select-none">
          DDIN empowers agents and individuals to perform critical financial and
          public services at the click of a button.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/login"
            className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
          <Link
            href="/registration"
            className="px-10 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-2xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
          >
            Register
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 select-none">
          What You Can Do
        </h3>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
        >
          {features.map(({ name, icon: Icon }, index) => (
            <motion.button
              key={index}
              variants={fadeUp}
              onClick={goToLogin}
              className="flex flex-col items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
              aria-label={`Go to login to access ${name}`}
              type="button"
            >
              <Icon className="w-14 h-14 mb-6 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                {name}
              </h4>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Agency Banking Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 select-none">
          Agency Banking Partners
        </h3>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-4 gap-10 max-w-xl mx-auto"
        >
          {banks.map(({ name, icon: Icon }, idx) => (
            <motion.button
              key={idx}
              variants={fadeUp}
              onClick={goToLogin}
              className="flex flex-col items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
              aria-label={`Go to login to access ${name} services`}
              type="button"
            >
              <Icon className="w-12 h-12 mb-5 text-green-600 dark:text-green-400" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {name}
              </h4>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Add More Service Form Section */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 select-none">
          Request a New Service
        </h3>

        <motion.form
          onSubmit={handleServiceSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl max-w-lg mx-auto"
          aria-label="Add new service request form"
        >
          <label
            htmlFor="newService"
            className="block text-gray-800 dark:text-gray-200 font-semibold mb-2"
          >
            Service Name
          </label>
          <input
            id="newService"
            type="text"
            placeholder="Enter service name (e.g., Water Bill)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 mb-6 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            required
            minLength={3}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-semibold transition shadow-lg hover:shadow-xl"
            aria-live="polite"
          >
            Submit Request
          </button>
          {submitted && (
            <p
              role="alert"
              className="mt-4 text-center text-green-600 dark:text-green-400 font-semibold"
            >
              Thank you! Your request has been submitted.
            </p>
          )}
        </motion.form>
      </section>
    </div>
  );
}
