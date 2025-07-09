'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';

export default function ElectricityPayment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    meterNumber: '',
    customerName: '',
    amount: '',
    receiptId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = async () => {
    if (step === 1) {
      setLoading(true);
      setTimeout(() => {
        setFormData(prev => ({ ...prev, customerName: 'John Doe' }));
        setStep(2);
        setLoading(false);
      }, 1000);
    } else if (step === 2) {
      setStep(3); // Show confirmation
    } else if (step === 3) {
      const id = 'REC' + Date.now();
      setFormData(prev => ({ ...prev, receiptId: id }));
      setStep(4); // Show receipt
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt');
    if (element) {
      html2pdf().from(element).save(`receipt_${formData.receiptId}.pdf`);
    }
  };

  return (
    <div className="mt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6 border border-gray-300 dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Electricity Payment</h1>
          <Zap className="w-6 h-6 text-yellow-500" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <Input
                label="Enter Meter Number"
                name="meterNumber"
                value={formData.meterNumber}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Customer: {formData.customerName}</div>
              <Input
                label="Amount to Pay"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl space-y-2 text-sm">
                <p className="font-semibold text-gray-800 dark:text-white">Please confirm your payment:</p>
                <p className="text-gray-700 dark:text-gray-300">Customer: {formData.customerName}</p>
                <p className="text-gray-700 dark:text-gray-300">Meter Number: {formData.meterNumber}</p>
                <p className="text-gray-700 dark:text-gray-300">Amount: RWF {formData.amount}</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <div id="receipt" className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-sm space-y-1">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Payment Receipt</h2>
                <p>Receipt ID: <strong>{formData.receiptId}</strong></p>
                <p>Customer: {formData.customerName}</p>
                <p>Meter Number: {formData.meterNumber}</p>
                <p>Amount: RWF {formData.amount}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              ← Back
            </button>
          )}

          {step < 3 && (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Next'}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition w-full sm:w-auto"
            >
              Confirm Payment
            </button>
          )}

          {step === 4 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition w-full sm:w-auto"
              >
                Save PDF
              </button>
              <Link
                href="/dashboard/services"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-xl text-center w-full sm:w-auto"
              >
                Back to Services
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const stepAnimation = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

function Input({ label, name, value, onChange, type = 'text' }: any) {
  return (
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>
  );
}
