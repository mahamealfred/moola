"use client";
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const stepAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export default function DepositForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountNumber: '',
    customerName: '',
    depositAmount: '',
    receiptId: '',
    sendername: '',
    senderphone: '',
    senderaccount: '',
    narration: '',
  });

  const bearerToken = localStorage.getItem("accessToken") // Replace with your actual token or get it from context/auth

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Validate account number endpoint
  const validateAccountNumber = async () => {
    if (!formData.accountNumber) {
      toast.error('Please enter an account number');
      return false;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/v1/agencytest/eco/services/getcustomerdetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountno: formData.accountNumber }),
      });

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, customerName: data.data.customername }));
        toast.success('Account validated successfully!');
        setStep(2);
        return true;
      } else {
        toast.error(data.message || 'Failed to validate account');
        return false;
      }
    } catch (error) {
      toast.error('Network error while validating account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Confirm deposit endpoint call with bearer token
  const confirmDeposit = async () => {
    if (!formData.depositAmount || !formData.narration) {
      toast.error('Please fill in all required fields');
      return false;
    }
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/v1/agencytest/eco/services/execute/cash-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          sendername: formData.sendername,
          senderphone: formData.senderphone,
          senderaccount: formData.accountNumber,
          ccy: 'RWF',
          narration: formData.narration,
          amount: Number(formData.depositAmount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Deposit successful!');
        const id = 'REC' + Date.now();
        setFormData((prev) => ({
          ...prev,
          receiptId: id,
          // Optionally update other response data if needed
        }));
        setStep(4);
        return true;
      } else {
        toast.error(data.message || 'Deposit failed');
        return false;
      }
    } catch (error) {
      toast.error('Network error during deposit confirmation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      await validateAccountNumber();
    } else if (step === 2) {
      if (!formData.depositAmount || !formData.narration) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      await confirmDeposit();
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt');
    if (element) {
      html2pdf().from(element).save(`deposit_receipt_${formData.receiptId}.pdf`);
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
                label="Enter Account Number"
                name="accountNumber"
                value={formData.accountNumber}
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
                label="Deposit Amount"
                name="depositAmount"
                type="number"
                value={formData.depositAmount}
                onChange={handleChange}
              />
              <Input
                label="Sender Name"
                name="sendername"
                value={formData.sendername}
                onChange={handleChange}
              />
              <Input
                label="Sender Phone"
                name="senderphone"
                value={formData.senderphone}
                onChange={handleChange}
              />
              <Input
                label="Narration"
                name="narration"
                value={formData.narration}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <div className="bg-yellow-50 dark:bg-yellow-900 p-5 rounded-xl text-sm space-y-2">
                <p className="font-semibold text-gray-800 dark:text-white">Confirm Deposit Details:</p>
                <p className="text-gray-700 dark:text-gray-300">Customer: {formData.customerName}</p>
                <p className="text-gray-700 dark:text-gray-300">Account Number: {formData.accountNumber}</p>
                <p className="text-gray-700 dark:text-gray-300">Amount: RWF {formData.depositAmount}</p>
                <p className="text-gray-700 dark:text-gray-300">Sender: {formData.sendername} ({formData.senderphone})</p>
                <p className="text-gray-700 dark:text-gray-300">Narration: {formData.narration}</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <div id="receipt" className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl text-sm space-y-2">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Deposit Receipt</h2>
                <p>Receipt ID: <strong>{formData.receiptId}</strong></p>
                <p>Customer: {formData.customerName}</p>
                <p>Account: {formData.accountNumber}</p>
                <p>Amount: RWF {formData.depositAmount}</p>
                <p>Sender: {formData.sendername} ({formData.senderphone})</p>
                <p>Narration: {formData.narration}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
              disabled={loading}
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
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Deposit'}
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

function Input({ label, name, value, onChange, type = 'text' }: { label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string; }) {
  return (
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
}
