'use client';
export const runtime = 'edge';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Coins, PlusCircle } from 'lucide-react';

export default function BalancePage() {
  const [topupAmount, setTopupAmount] = useState('');

  const handleTopup = () => {
    alert(`Topping up with RWF ${topupAmount}`);
    setTopupAmount('');
  };

  return (
    <div className="relative z-10 space-y-8 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#13294b] dark:text-white text-center">
        Wallet Overview
      </h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Float Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] rounded-full p-3">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Float Balance</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#ff6600]">RWF 120,000</p>
              <p className="text-xs text-gray-400 mt-1">As of July 9, 2025</p>
            </div>
          </div>
        </motion.div>

        {/* Commission Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#ff660020] dark:bg-[#ff660030] text-[#ff6600] rounded-full p-3">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Commissions</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#ff6600]">RWF 45,500</p>
              <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top-Up Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all"
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
          Top-Up Float
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-center sm:justify-start">
          <input
            type="number"
            placeholder="Enter amount (RWF)"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
          />
          <button
            onClick={handleTopup}
            disabled={!topupAmount}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00] transition disabled:opacity-50 font-semibold"
          >
            <PlusCircle className="w-5 h-5" />
            Top-Up Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
