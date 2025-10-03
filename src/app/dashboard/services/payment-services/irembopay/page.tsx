'use client';

import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  serviceType: string;
  idNumber: string;
  customerName: string;
  amount: number;
  receiptId: string;
}

export default function IremboPayment() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    idNumber: '',
    customerName: '',
    amount: 0,
    receiptId: ''
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  async function validateID(idNumber: string) {
    return new Promise<{ customerName: string; amount: number }>((resolve) => {
      setTimeout(() => {
        resolve({
          customerName: 'Alice Uwase',
          amount: 0, // Default amount, user will input their own
        });
      }, 1200);
    });
  }

  async function handleNext() {
    if (step === 1) {
      if (!formData.serviceType || formData.idNumber.trim().length < 5) {
        alert('Please select service type and enter valid ID Number.');
        return;
      }
      setLoading(true);
      try {
        const data = await validateID(formData.idNumber.trim());
        
        setFormData(prev => ({
          ...prev,
          customerName: data.customerName,
        }));
        setStep(2);
      } catch {
        alert('ID validation failed. Try again.');
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (formData.amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setFormData(prev => ({
        ...prev,
        receiptId: 'IREMBO' + Date.now()
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
      const opt = {
        margin: 0.5,
        filename: `irembo_payment_receipt_${formData.receiptId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700"
      >
        {/* Irembo Header with Original Colors */}
        <div className="mb-4 md:mb-5 text-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#ff6600] dark:text-[#ff6600]">Irembo Services</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Access government services securely</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-5">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative z-10">
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                  step >= i 
                    ? 'bg-[#ff6600] text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {i}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px] md:text-xs text-gray-500">
            <span>Service Info</span>
            <span>Amount</span>
            <span>Confirm</span>
            <span>Receipt</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">Select Service & Validate ID</h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label htmlFor="serviceType" className="block mb-1 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                    Select Service Type
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={onInputChange}
                    disabled={loading}
                    className="w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
                  >
                    <option value="">Choose a service</option>
                    <option value="passport">Passport Application</option>
                    <option value="driving_license">Driving License</option>
                    <option value="birth_certificate">Birth Certificate</option>
                    <option value="land_registration">Land Registration</option>
                    <option value="business_registration">Business Registration</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Enter ID Number"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={onInputChange}
                    disabled={loading}
                    placeholder="e.g., 119988007766"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Enter Payment Amount</h2>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm md:text-base flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h3>
                  <div className="text-gray-900 dark:text-white space-y-1 md:space-y-2 text-sm md:text-base mb-4">
                    <p>
                      <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Name</strong>
                      {formData.customerName}
                    </p>
                    <p>
                      <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">ID Number</strong>
                      {formData.idNumber}
                    </p>
                    <p>
                      <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Service Type</strong>
                      {formData.serviceType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      label="Enter Amount (RWF)"
                      name="amount"
                      type="number"
                      value={formData.amount.toString()}
                      onChange={onInputChange}
                      placeholder="e.g., 15000"
                    />
                  </div>
                  
                  <p className="font-semibold mt-2 md:mt-3 border-t pt-2 text-[#ff6600] text-base md:text-lg">
                    <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Amount to Pay</strong>
                    RWF {formData.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Confirm Payment</h2>
              <div className="bg-[#ff660010] dark:bg-[#ff660020] p-3 md:p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">Please confirm your payment details</h3>
                <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm md:text-base">
                  <div>
                    <p>
                      <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Customer Name</strong>
                      {formData.customerName}
                    </p>
                    <p className="mt-1 md:mt-2">
                      <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">ID Number</strong>
                      {formData.idNumber}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Service Type</strong>
                      {formData.serviceType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                    <p className="mt-1 md:mt-2">
                      <strong className="block text-xs md:text-sm text-gray:500 dark:text-gray-400">Amount</strong>
                      RWF {formData.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="font-semibold mt-3 md:mt-4 border-t pt-2 md:pt-3 text-[#ff6600] text-base md:text-lg">
                  <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Amount to Pay</strong>
                  RWF {formData.amount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Payment Successful</h2>
              <div
                id="receipt"
                className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="text-center mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-600 pb-2 md:pb-3">
                  <div className="flex items-center justify-center space-x-1 md:space-x-2">
                    <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-md md:text-lg font-bold text-[#ff6600] dark:text-[#ff6600]">Irembo Payment Receipt</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Official Government Service Receipt</p>
                </div>
                
                <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div>
                      <p>
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Receipt ID</strong>
                        {formData.receiptId}
                      </p>
                      <p className="mt-1 md:mt-2">
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Date</strong>
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">ID Number</strong>
                        {formData.idNumber}
                      </p>
                      <p className="mt-1 md:mt-2">
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Customer Name</strong>
                        {formData.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#ff660010] dark:bg-[#ff660020] p-2 md:p-3 rounded">
                    <h4 className="font-semibold text-[#ff6600] dark:text-[#ff6600] mb-1 text-sm md:text-base">Service & Payment Details</h4>
                    <div className="space-y-1 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span>Service Type:</span>
                        <span>{formData.serviceType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>RWF {formData.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1 text-[#ff6600] dark:text-[#ff6600]">
                        <span>Total Paid:</span>
                        <span>RWF {formData.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Thank you for using Irembo services. Your transaction was completed successfully.
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
                    ID: {formData.receiptId} | {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-4 md:mt-5 flex flex-col-reverse sm:flex-row gap-2 md:gap-3 justify-between items-center">
          {step > 1 && step < 4 && (
            <button
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-300 hover:underline py-1.5 px-3 md:py-2 md:px-4 rounded text-sm md:text-base w-full sm:w-auto text-center flex items-center justify-center"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}

          {step < 3 && (
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full sm:w-auto font-semibold transition disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </>
              ) : (
                <>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleNext}
              className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full sm:w-auto font-semibold flex items-center justify-center"
            >
              Confirm Payment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}

          {step === 4 && (
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
              <button
                onClick={downloadPDF}
                className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full font-semibold flex items-center justify-center"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download Receipt
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full text-center font-semibold"
              >
                New Service
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const stepAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled = false,
  placeholder = ''
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="mb-3 md:mb-4">
      <label htmlFor={name} className="block mb-1 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required
        className="w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
      />
    </div>
  );
}