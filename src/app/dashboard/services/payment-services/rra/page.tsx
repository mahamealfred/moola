'use client';

import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  tin: string;
  taxpayerName: string;
  amountDue: number;       // Actual tax due
  serviceFee: number;      // Fixed fee
  receiptId: string;
}

export default function RraPayment() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tin: '',
    taxpayerName: '',
    amountDue: 0,
    serviceFee: 0,
    receiptId: ''
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Calculate service fee based on amount due
  const calculateServiceFee = (due: number): number => {
    if (due >= 1 && due <= 1000) return 160;
    if (due >= 1001 && due <= 10000) return 300;
    if (due >= 10001 && due <= 40000) return 500;
    if (due >= 40001 && due <= 75000) return 1000;
    if (due >= 75001 && due <= 150000) return 1500;
    if (due >= 150001 && due <= 500000) return 2000;
    if (due >= 500001) return 3000;
    return 0;
  };

  async function validateTin(tin: string) {
    // Simulate API call, replace with your real API
    return new Promise<{ taxpayerName: string; amountDue: number }>((resolve) => {
      setTimeout(() => {
        resolve({
          taxpayerName: 'ABC Company Ltd',
          amountDue: 89500,
        });
      }, 1200);
    });
  }

  async function handleNext() {
    if (step === 1) {
      if (formData.tin.trim().length < 5) {
        alert('Please enter a valid TIN.');
        return;
      }
      setLoading(true);
      try {
        const data = await validateTin(formData.tin.trim());
        const fee = calculateServiceFee(data.amountDue);
        setFormData(prev => ({
          ...prev,
          taxpayerName: data.taxpayerName,
          amountDue: data.amountDue,
          serviceFee: fee
        }));
        setStep(2);
      } catch {
        alert('TIN validation failed. Try again.');
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setFormData(prev => ({
        ...prev,
        receiptId: 'RRR' + Date.now()
      }));
      setStep(4);
    }
  }

  function handleBack() {
    if (loading) return;
    if (step > 1) setStep(prev => (prev - 1) as Step);
  }

  function downloadPDF() {
    const element = document.getElementById('receipt');
    if (element) {
      html2pdf().from(element).save(`rra_receipt_${formData.receiptId}.pdf`);
    }
  }

  const totalAmount = formData.amountDue + formData.serviceFee;

  return (
    <div>
      <motion.div
        className="max-w-xl w-full p-8 rounded-xl border border-gray-300 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <Input
                label="Enter Doc ID"
                name="tin"
                value={formData.tin}
                onChange={onInputChange}
                disabled={loading}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <strong>Taxpayer:</strong> {formData.taxpayerName}
              </p>
              <div className="text-gray-900 dark:text-white space-y-2">
                <p>
                  <strong>Tax Amount Due:</strong> RWF {formData.amountDue.toLocaleString()}
                </p>
                <p>
                  <strong>Service Fee:</strong> RWF {formData.serviceFee.toLocaleString()}
                </p>
                <p className="text-lg font-semibold mt-4 border-t pt-2">
                  <strong>Total Amount to Pay:</strong> RWF {totalAmount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl">
                <h2 className="font-semibold mb-2 text-gray-800 dark:text-white">Confirm Payment</h2>
                <p><strong>TIN:</strong> {formData.tin}</p>
                <p><strong>Taxpayer:</strong> {formData.taxpayerName}</p>
                <p><strong>Tax Amount Due:</strong> RWF {formData.amountDue.toLocaleString()}</p>
                <p><strong>Service Fee:</strong> RWF {formData.serviceFee.toLocaleString()}</p>
                <p className="text-lg font-semibold mt-4 border-t pt-2">
                  <strong>Total Amount to Pay:</strong> RWF {totalAmount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <div
                id="receipt"
                className="p-5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700"
              >
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">RRA Payment Receipt</h2>
                <p><strong>Receipt ID:</strong> {formData.receiptId}</p>
                <p><strong>TIN:</strong> {formData.tin}</p>
                <p><strong>Taxpayer:</strong> {formData.taxpayerName}</p>
                <p><strong>Tax Amount Paid:</strong> RWF {formData.amountDue.toLocaleString()}</p>
                <p><strong>Service Fee Paid:</strong> RWF {formData.serviceFee.toLocaleString()}</p>
                <p className="text-lg font-semibold mt-4 border-t pt-2">
                  <strong>Total Paid:</strong> RWF {totalAmount.toLocaleString()}
                </p>

                <div className="mt-5">
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">Verify via QR Code:</p>
                  <QRCodeCanvas
                    value={JSON.stringify(formData)}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          {step > 1 && step < 4 && (
            <button
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-300 hover:underline"
              disabled={loading}
            >
              ← Back
            </button>
          )}

          {step < 3 && (
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl w-full sm:w-auto font-semibold disabled:opacity-60"
            >
              {loading ? 'Validating...' : 'Next'}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl w-full sm:w-auto font-semibold"
            >
              Confirm Payment
            </button>
          )}

          {step === 4 && (
            <div className="flex gap-3 w-full sm:justify-end flex-col sm:flex-row">
              <button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl w-full sm:w-auto font-semibold"
              >
                Download Receipt PDF
              </button>
              <Link
                href="/dashboard/services"
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-xl w-full sm:w-auto text-center font-semibold"
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
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3 }
};

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
