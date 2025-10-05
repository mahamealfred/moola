'use client';

import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { secureStorage } from '@/lib/auth-context';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  phoneNumber: string;
  provider: string;
  amount: number;
  receiptId: string;
}

interface ValidationResponse {
  success: boolean;
  message: string;
  data: {
    productId: string;
    productName: string;
    customerId: string;
    customerName: string;
    maxAmount: number;
    requestId: string;
  };
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: number;
    requestId: string;
    amount: string;
    subagentCode: number;
    agentName: string;
    token: string | null;
    units: string | null;
    deliveryMethod: string;
  };
}

export default function AirtimePurchase() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    provider: 'MTN',
    amount: 0,
    receiptId: ''
  });
  const [validationData, setValidationData] = useState<ValidationResponse['data'] | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Country code for Rwanda
  const countryCode = '+250';

  // Input validation rules
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^(78|79|72|73)\d{7}$/.test(value)) return 'Please enter a valid MTN or Airtel number (78, 79, 72, or 73)';
        if (value.length !== 9) return 'Phone number must be 9 digits';
        return '';
      
      case 'amount':
        const numValue = Number(value);
        if (!value.trim()) return 'Amount is required';
        if (isNaN(numValue) || numValue <= 0) return 'Amount must be greater than 0';
        if (numValue < 100) return 'Minimum amount is RWF 100';
        if (validationData && numValue > validationData.maxAmount) {
          return `Maximum amount is RWF ${validationData.maxAmount.toLocaleString()}`;
        }
        return '';
      
      default:
        return '';
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onInputBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  async function validatePhone(phone: string) {
    try {
  const response = await fetch('https://core-api.ddin.rw/v1/agency/thirdpartyagency/services/validate/biller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          billerCode: "airtime",
          productCode: "airtime",
          customerId: phone
        })
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data: ValidationResponse = await response.json();
      
      if (data.success) {
        setValidationData(data.data);
        return { isValid: true, validationData: data.data };
      } else {
        return { isValid: false, message: data.message };
      }
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  async function processPayment() {
    if (!validationData) {
      throw new Error('Validation data not found');
    }

    try {
      const accessToken = secureStorage.getAccessToken();
            
      if (!accessToken) {
        throw new Error('Authentication required. Please login again.');
      }

  const response = await fetch('https://core-api.ddin.rw/v1/agency/thirdpartyagency/services/execute/bill-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          email: "mahamealfred@gmail.com",
          clientPhone: `${countryCode}${formData.phoneNumber}`,
          customerId: formData.phoneNumber,
          billerCode: "airtime",
          productCode: "airtime",
          amount: formData.amount.toString(),
          ccy: "RWF",
          requestId: validationData.requestId
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data: PaymentResponse = await response.json();
      
      if (data.success) {
        setPaymentData(data.data);
        return { success: true, paymentData: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  async function handleNext() {
    // Validate current step before proceeding
    if (step === 1) {
      const phoneError = validateField('phoneNumber', formData.phoneNumber);
      if (phoneError) {
        setErrors({ phoneNumber: phoneError });
        return;
      }

      setLoading(true);
      try {
        const data = await validatePhone(formData.phoneNumber.trim());
        
        if (!data.isValid) {
          alert(data.message || 'Phone number validation failed. Please check the number and try again.');
          return;
        }
        
        setStep(2);
      } catch {
        alert('Phone validation failed. Try again.');
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      const amountError = validateField('amount', formData.amount.toString());
      if (amountError) {
        setErrors({ amount: amountError });
        return;
      }
      
      setStep(3);
    } else if (step === 3) {
      setLoading(true);
      try {
        const result = await processPayment();
        
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            receiptId: `AIRT${result.paymentData?.transactionId || Date.now()}`
          }));
          setStep(4);
        } else {
          alert(result.message || 'Payment failed. Please try again.');
        }
      } catch {
        alert('Payment processing failed. Please try again.');
      } finally {
        setLoading(false);
      }
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
        filename: `airtime_purchase_receipt_${formData.receiptId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  }

  // Format phone number with country code for display
  const formatPhoneNumber = (phone: string) => {
    return `${countryCode} ${phone}`;
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700"
      >
        {/* Airtime Header */}
        <div className="mb-4 md:mb-5 text-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#ff6600] dark:text-[#ff6600]">Airtime Purchase</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Buy airtime for MTN or Airtel</p>
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
            <span>Phone Info</span>
            <span>Amount</span>
            <span>Confirm</span>
            <span>Receipt</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">Enter Phone Details</h2>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {/* Provider Selection as Radio Buttons */}
                <div className="mb-3 md:mb-4">
                  <label className="block mb-2 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                    Select Provider
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="provider"
                        value="MTN"
                        checked={formData.provider === 'MTN'}
                        onChange={onInputChange}
                        className="text-[#ff6600] focus:ring-[#ff6600]"
                      />
                      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">MTN Rwanda</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="provider"
                        value="Airtel"
                        checked={formData.provider === 'Airtel'}
                        onChange={onInputChange}
                        className="text-[#ff6600] focus:ring-[#ff6600]"
                      />
                      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Airtel Rwanda</span>
                    </label>
                  </div>
                </div>
                
                {/* Phone Number Input with Country Code */}
                <div>
                  <label htmlFor="phoneNumber" className="block mb-1 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                    Enter Phone Number
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l text-gray-600 dark:text-gray-300 text-sm">
                      {countryCode}
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={onInputChange}
                      onBlur={onInputBlur}
                      disabled={loading}
                      placeholder="781234567"
                      className="flex-1 px-2.5 py-1.5 md:px-3 md:py-2 rounded-r border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your {formData.provider} number starting with 78, 79, 72, or 73
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Enter Airtime Amount</h2>
              
              {/* Horizontal Layout for Phone Information */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 text-sm md:text-base flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base">
                  <div className="bg-white dark:bg-gray-600 p-3 rounded">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Provider</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{formData.provider}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-600 p-3 rounded">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{formatPhoneNumber(formData.phoneNumber)}</p>
                  </div>
                  
                  {validationData && (
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {validationData.customerName || 'Not available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Input */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                <div className="mb-4">
                  <Input
                    label="Enter Amount (RWF)"
                    name="amount"
                    type="number"
                    value={formData.amount.toString()}
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    error={errors.amount}
                    placeholder="e.g., 1000"
                    min={100}
                    max={validationData?.maxAmount || 250000}
                  />
                  {validationData && (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: RWF 100 | Maximum: RWF {validationData.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Select:</p>
                  <div className="flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, amount }));
                          if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                        }}
                        className="px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-500 transition"
                      >
                        RWF {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="font-semibold text-[#ff6600] text-base md:text-lg">
                    <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount to Pay</span>
                    RWF {formData.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Confirm Purchase</h2>
              <div className="bg-[#ff660010] dark:bg-[#ff660020] p-3 md:p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 text-sm md:text-base">Please confirm your airtime purchase</h3>
                
                {/* Horizontal confirmation layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Provider</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{formData.provider}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{formatPhoneNumber(formData.phoneNumber)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-gray-900 dark:text-white font-semibold">RWF {formData.amount.toLocaleString()}</p>
                    </div>
                    {validationData && (
                      <div className="bg-white dark:bg-gray-600 p-3 rounded">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Request ID</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-xs">{validationData.requestId}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="font-semibold text-[#ff6600] text-base md:text-lg">
                    <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Amount to Pay</span>
                    RWF {formData.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Purchase Successful</h2>
              <div
                id="receipt"
                className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                {/* Receipt content remains the same */}
                <div className="text-center mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-600 pb-2 md:pb-3">
                  <div className="flex items-center justify-center space-x-1 md:space-x-2">
                    <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-md md:text-lg font-bold text-[#ff6600] dark:text-[#ff6600]">Airtime Purchase Receipt</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Official Purchase Receipt</p>
                </div>
                
                <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <div>
                      <p>
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Receipt ID</strong>
                        {formData.receiptId}
                      </p>
                      <p className="mt-1 md:mt-2">
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Date</strong>
                        {new Date().toLocaleDateString()}
                      </p>
                      {paymentData && (
                        <p className="mt-1 md:mt-2">
                          <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Transaction ID</strong>
                          {paymentData.transactionId}
                        </p>
                      )}
                    </div>
                    <div>
                      <p>
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Provider</strong>
                        {formData.provider}
                      </p>
                      <p className="mt-1 md:mt-2">
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Phone Number</strong>
                        {formatPhoneNumber(formData.phoneNumber)}
                      </p>
                      {paymentData && (
                        <p className="mt-1 md:mt-2">
                          <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Request ID</strong>
                          {paymentData.requestId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#ff660010] dark:bg-[#ff660020] p-2 md:p-3 rounded">
                    <h4 className="font-semibold text-[#ff6600] dark:text-[#ff6600] mb-1 text-sm md:text-base">Purchase Details</h4>
                    <div className="space-y-1 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span>Airtime Amount:</span>
                        <span>RWF {formData.amount.toLocaleString()}</span>
                      </div>
                      {paymentData && (
                        <div className="flex justify-between">
                          <span>Delivery Method:</span>
                          <span>{paymentData.deliveryMethod}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-1 text-[#ff6600] dark:text-[#ff6600]">
                        <span>Total Paid:</span>
                        <span>RWF {formData.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Thank you for your purchase. Airtime has been credited successfully.
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
                    ID: {formData.receiptId} | {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons - Same as before */}
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
                  {step === 1 ? 'Validating...' : 'Processing...'}
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
              disabled={loading}
              className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full sm:w-auto font-semibold flex items-center justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </>
              ) : (
                <>
                  Confirm Purchase
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
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
                New Purchase
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

// Updated Input component with error handling
function Input({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = 'text',
  disabled = false,
  placeholder = '',
  error = '',
  min,
  max
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
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
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        required
        className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base ${
          error 
            ? 'border-red-500 dark:border-red-400' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}