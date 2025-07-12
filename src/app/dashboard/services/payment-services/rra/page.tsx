'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

export default function RraPayment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tin: '',
    taxpayerName: '',
    amount: '',
    receiptId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateAmount = (amountDue: number) => {
    if (amountDue >= 1 && amountDue <= 1000) {
      return 160;
    } else if (amountDue >= 1001 && amountDue <= 10000) {
      return 300;
    } else if (amountDue >= 10001 && amountDue <= 40000) {
      return 500;
    } else if (amountDue >= 40001 && amountDue <= 75000) {
      return 1000;
    } else if (amountDue >= 75001 && amountDue <= 150000) {
      return 1500;
    } else if (amountDue >= 150001 && amountDue <= 500000) {
      return 2000;
    } else if (amountDue >= 500001) {
      return 3000;
    } else {
      return 0;
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      setLoading(true);
      setTimeout(() => {
        // Simulate fetching data from backend
        const taxpayerName = 'ABC Company Ltd';
        const amountDue = 89500; // Mocked backend value

        const calculatedAmount = calculateAmount(amountDue);

        setFormData(prev => ({
          ...prev,
          taxpayerName,
          amount: String(calculatedAmount)
        }));
        setStep(2);
        setLoading(false);
      }, 1000);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const id = 'RRR' + Date.now();
      setFormData(prev => ({ ...prev, receiptId: id }));
      setStep(4);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt');
    if (element) {
      html2pdf().from(element).save(`rra_receipt_${formData.receiptId}.pdf`);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200 dark:border-gray-700"
      >
        {/* <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white"></h1>
          <FileText className="w-6 h-6 text-blue-600" />
        </div> */}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <Input
                label="Enter TIN"
                name="tin"
                value={formData.tin}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Taxpayer: <strong>{formData.taxpayerName}</strong>
              </div>
              <div className="text-sm text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700">
                Amount to Pay (Auto-Calculated): <strong>RWF {formData.amount}</strong>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl text-sm space-y-2">
                <h2 className="font-semibold text-gray-800 dark:text-white">Confirm Tax Payment</h2>
                <p className="text-gray-700 dark:text-gray-300">Taxpayer: {formData.taxpayerName}</p>
                <p className="text-gray-700 dark:text-gray-300">TIN: {formData.tin}</p>
                <p className="text-gray-700 dark:text-gray-300">Amount: RWF {formData.amount}</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <div
                id="receipt"
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-sm space-y-3 border border-gray-300 dark:border-gray-700"
              >
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Tax Payment Receipt</h2>
                <p>Receipt ID: <strong>{formData.receiptId}</strong></p>
                <p>Taxpayer: {formData.taxpayerName}</p>
                <p>TIN: {formData.tin}</p>
                <p>Amount Paid: RWF {formData.amount}</p>

                <div className="pt-3">
                  <p className="font-medium mb-2 text-gray-800 dark:text-white">Scan QR Code to verify</p>
                  <QRCodeCanvas
                    value={JSON.stringify({
                      receiptId: formData.receiptId,
                      tin: formData.tin,
                      taxpayerName: formData.taxpayerName,
                      amount: formData.amount
                    })}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
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
