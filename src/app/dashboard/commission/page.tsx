'use client';
export const runtime = 'edge';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Coins, Download } from 'lucide-react';

export default function CommissionPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = () => {
    // TODO: Implement withdraw logic
    alert(`Withdrawing RWF ${withdrawAmount} from commission`);
    setWithdrawAmount('');
  };

  return (
    <div className="relative z-10 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Commission Dashboard
      </h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Commission Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-full p-3">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available Commission</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">RWF 45,500</p>
              <p className="text-xs text-gray-400 mt-1">Ready to withdraw</p>
            </div>
          </div>
        </motion.div>

        {/* Delayed Commission Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-3">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Delayed Commission</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">RWF 8,000</p>
              <p className="text-xs text-gray-400 mt-1">Pending release</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Withdraw Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Withdraw Commission</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <input
            type="number"
            placeholder="Enter amount (RWF)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleWithdraw}
            disabled={!withdrawAmount}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Withdraw Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
