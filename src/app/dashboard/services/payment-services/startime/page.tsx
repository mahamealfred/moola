'use client';

import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';

type FormData = {
  smartCardNumber: string;
  customerName: string;
  amount: string;
  receiptId: string;
};

export default function StartimesPayment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    smartCardNumber: '',
    customerName: '',
    amount: '',
    receiptId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.smartCardNumber) return;
      setLoading(true);
      setTimeout(() => {
        setFormData(prev => ({ ...prev, customerName: 'Jane Smith' }));
        setStep(2);
        setLoading(false);
      }, 1000);
    } else if (step === 2) {
      if (!formData.amount) return;
      setStep(3);
    } else if (step === 3) {
      const id = 'ST-' + Date.now();
      setFormData(prev => ({ ...prev, receiptId: id }));
      setStep(4);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt');
    if (element) {
      html2pdf().from(element).save(`startimes_receipt_${formData.receiptId}.pdf`);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-6"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <Input
                label="Smart Card Number"
                name="smartCardNumber"
                value={formData.smartCardNumber}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Customer: <strong>{formData.customerName}</strong>
              </div>
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
              <div className="bg-yellow-50 dark:bg-yellow-900 p-5 rounded-xl text-sm space-y-2">
                <p className="font-semibold text-gray-800 dark:text-white">Please confirm your payment:</p>
                <p className="text-gray-700 dark:text-gray-300">Customer: {formData.customerName}</p>
                <p className="text-gray-700 dark:text-gray-300">Smart Card: {formData.smartCardNumber}</p>
                <p className="text-gray-700 dark:text-gray-300">Amount: RWF {formData.amount}</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <div id="receipt" className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl text-sm space-y-2">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Startimes Payment Receipt</h2>
                <p>Receipt ID: <strong>{formData.receiptId}</strong></p>
                <p>Customer: {formData.customerName}</p>
                <p>Smart Card: {formData.smartCardNumber}</p>
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
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Next'}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition"
            >
              Confirm Payment
            </button>
          )}

          {step === 4 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
              <button
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition"
              >
                Save PDF
              </button>
              <Link
                href="/dashboard/services"
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-xl text-center"
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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const Input: React.FC<InputProps> = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="w-full space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
      required
    />
  </div>
);
