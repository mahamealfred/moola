'use client';

import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { useTranslation } from '@/lib/i18n-context';
import api from '@/lib/api-client';
import { secureStorage } from '@/lib/auth-context';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  docNumber: string;
  customerName: string;
  amount: number;
  serviceFee: number;
  vat: number;
  rraTax: number;
  receiptId: string;
}

interface ValidationResponse {
  success: boolean;
  message: string;
  data?: {
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

export default function RRAPayment() {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    docNumber: '',
    customerName: '',
    amount: 0,
    serviceFee: 0,
    vat: 0,
    rraTax: 0,
    receiptId: ''
  });
  const [validationData, setValidationData] = useState<ValidationResponse['data'] | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string>('');

  // Input validation rules
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'docNumber':
        if (!value.trim()) return t('rra.docNumberRequired');
        if (!/^\d+$/.test(value)) return t('rra.docNumberDigitsOnly');
        if (value.length < 5) return t('rra.docNumberMin5');
        if (value.length > 20) return t('rra.docNumberTooLong');
        return '';
      
      default:
        return '';
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear errors for this field and API errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onInputBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Service fee calculator for RRA
  const calculateServiceFee = (amount: number): number => {
    if (amount >= 1 && amount <= 1000) return 160;
    if (amount <= 10000) return 300;
    if (amount <= 40000) return 500;
    if (amount <= 75000) return 1000;
    if (amount <= 150000) return 1500;
    if (amount <= 500000) return 2000;
    if (amount > 500000) return 3000;
    return 0;
  };

  // Calculate VAT (18% on service fee)
  const calculateVAT = (serviceFee: number): number => {
    return serviceFee * 0.18;
  };

  // RRA specific tax (1% of amount)
  const calculateRRATax = (amount: number): number => {
    return amount * 0.01;
  };

  async function validateDocument(docNumber: string) {
    try {
      const response = await api.post(`/agency/thirdpartyagency/services/validate/biller?language=${locale}`, {
        billerCode: "tax",
        productCode: "tax",
        customerId: docNumber
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          return { isValid: false, message: errorData.message || t('rra.docValidationFailed') };
        } catch {
          return { isValid: false, message: t('rra.docValidationFailed') };
        }
      }

      const data: ValidationResponse = await response.json();
      
      if (data.success) {
        setValidationData(data.data!);
        
        // Calculate fees based on the amount from API
        const amount = data.data!.maxAmount || 0;
        const serviceFee = calculateServiceFee(amount);
        const vat = calculateVAT(serviceFee);
        const rraTax = calculateRRATax(amount);
        
        setFormData(prev => ({
          ...prev,
          customerName: data.data!.customerName,
          amount: amount,
          serviceFee: serviceFee,
          vat: vat,
          rraTax: rraTax
        }));
        
        return { isValid: true, validationData: data.data };
      } else {
        return { isValid: false, message: data.message };
      }
    } catch (error) {
      console.log('Validation info:', error);
      throw error;
    }
  }

  async function processPayment() {
    if (!validationData) {
      throw new Error('Validation data not found');
    }

    try {
      const response = await api.postAuth(`/agency/thirdpartyagency/services/execute/bill-payment?language=${locale}`, {
        email: "mahamealfred@gmail.com",
        clientPhone: "+250789595309",
        customerId: formData.docNumber,
        billerCode: "tax",
        productCode: "tax",
        amount: totalAmount.toString(),
        ccy: "RWF",
        requestId: validationData.requestId
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          return { success: false, message: errorData.message || t('rra.paymentProcessingFailed') };
        } catch {
          return { success: false, message: t('rra.paymentProcessingFailed') };
        }
      }

      const data: PaymentResponse = await response.json();
      
      if (data.success) {
        setPaymentData(data.data);
        return { success: true, paymentData: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log('Payment info:', error);
      throw error;
    }
  }

  async function handleNext() {
    if (step === 1) {
      const docError = validateField('docNumber', formData.docNumber);
      if (docError) {
        setErrors({ docNumber: docError });
        return;
      }

      setLoading(true);
      setApiError(''); // Clear previous API errors
      try {
        const data = await validateDocument(formData.docNumber.trim());
        
        if (!data.isValid) {
          setApiError(data.message || t('rra.docValidationFailed'));
          return;
        }
        
        setStep(2);
      } catch (error) {
        setApiError(t('rra.docValidationFailed'));
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setLoading(true);
      setApiError(''); // Clear previous API errors
      try {
        const result = await processPayment();
        
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            receiptId: `RRA${result.paymentData?.transactionId || Date.now()}`
          }));
          setStep(4);
        } else {
          setApiError(result.message || t('rra.paymentProcessingFailed'));
        }
      } catch (error) {
        setApiError(t('rra.paymentProcessingFailed'));
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
        filename: `rra_payment_receipt_${formData.receiptId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  }

  const totalAmount = formData.amount + formData.serviceFee + formData.vat + formData.rraTax;

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700"
      >
        {/* RRA Header */}
        <div className="mb-4 md:mb-5 text-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#ff6600] dark:text-[#ff6600]">{t('rra.title')}</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('rra.subtitle')}</p>
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
            <span>{t('rra.docInfo')}</span>
            <span>{t('forms.amount')}</span>
            <span>{t('common.confirm')}</span>
            <span>{t('forms.receipt')}</span>
          </div>
        </div>

        {/* API Error Message Display */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {t('rra.validationError')}
                </h3>
                <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {apiError}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">{t('rra.validateDocNumber')}</h2>
              <div>
                <div className="mb-3 md:mb-4">
                  <Input
                    label={t('rra.enterDocNumber')}
                    name="docNumber"
                    value={formData.docNumber}
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    disabled={loading}
                    placeholder={t('rra.docNumberPlaceholder')}
                    error={errors.docNumber}
                  />
                  {!errors.docNumber && !apiError && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t('rra.docNumberHelp')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">{t('rra.paymentDetails')}</h2>
              
              {/* Horizontal Layout for Customer Information */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 text-sm md:text-base flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('rra.taxpayerInfo')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base">
                  <div className="bg-white dark:bg-gray-600 p-3 rounded">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">{t('rra.taxpayerName')}</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{formData.customerName}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-600 p-3 rounded">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">{t('rra.documentNumber')}</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{formData.docNumber}</p>
                  </div>
                  
                  {validationData && (
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">{t('rra.service')}</p>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {validationData.productName || t('rra.taxPayment')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 text-sm md:text-base flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('rra.paymentBreakdown')}
                </h3>
                
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('rra.taxAmount')}:</span>
                    <span className="text-gray-900 dark:text-white">RWF {formData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('rra.serviceFee')}:</span>
                    <span className="text-gray-900 dark:text-white">RWF {formData.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('rra.vat18')}:</span>
                    <span className="text-gray-900 dark:text-white">RWF {formData.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('rra.rraTax1')}:</span>
                    <span className="text-gray-900 dark:text-white">RWF {formData.rraTax.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <p className="font-semibold text-[#ff6600] text-base md:text-lg">
                    <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">{t('rra.totalAmountToPay')}</span>
                    RWF {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">{t('rra.confirmPayment')}</h2>
              <div className="bg-[#ff660010] dark:bg-[#ff660020] p-3 md:p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 text-sm md:text-base">{t('rra.confirmPaymentDetails')}</h3>
                
                {/* Horizontal confirmation layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.taxpayerName')}</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{formData.customerName}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.documentNumber')}</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{formData.docNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-600 p-3 rounded">
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.taxAmount')}</p>
                      <p className="text-gray-900 dark:text-white font-semibold">RWF {formData.amount.toLocaleString()}</p>
                    </div>
                    {validationData && (
                      <div className="bg-white dark:bg-gray-600 p-3 rounded">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.requestId')}</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-xs">{validationData.requestId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div className="bg-white dark:bg-gray-600 p-3 rounded mb-4">
                  <h4 className="font-semibold mb-2 text-sm md:text-base">{t('rra.feeBreakdown')}</h4>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span>{t('rra.serviceFee')}:</span>
                      <span>RWF {formData.serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('rra.vat18')}:</span>
                      <span>RWF {formData.vat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('rra.rraTax1')}:</span>
                      <span>RWF {formData.rraTax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="font-semibold text-[#ff6600] text-base md:text-lg">
                    <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.totalAmountToPay')}</span>
                    RWF {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...stepAnimation}>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">{t('rra.paymentSuccessful')}</h2>
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
                    <h3 className="text-md md:text-lg font-bold text-[#ff6600] dark:text-[#ff6600]">{t('rra.taxPaymentReceipt')}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('rra.officialReceipt')}</p>
                </div>
                
                <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <div>
                      <p>
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.receiptId')}</strong>
                        {formData.receiptId}
                      </p>
                      <p className="mt-1 md:mt-2">
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.date')}</strong>
                        {new Date().toLocaleDateString()}
                      </p>
                      {paymentData && (
                        <p className="mt-1 md:mt-2">
                          <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.transactionId')}</strong>
                          {paymentData.transactionId}
                        </p>
                      )}
                    </div>
                    <div>
                      <p>
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.documentNumber')}</strong>
                        {formData.docNumber}
                      </p>
                      <p className="mt-1 md:mt-2">
                        <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.taxpayerName')}</strong>
                        {formData.customerName}
                      </p>
                      {paymentData && (
                        <p className="mt-1 md:mt-2">
                          <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('rra.requestId')}</strong>
                          {paymentData.requestId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#ff660010] dark:bg-[#ff660020] p-2 md:p-3 rounded">
                    <h4 className="font-semibold text-[#ff6600] dark:text-[#ff6600] mb-1 text-sm md:text-base">{t('rra.paymentDetails')}</h4>
                    <div className="space-y-1 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span>{t('rra.taxAmount')}:</span>
                        <span>RWF {formData.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('rra.serviceFee')}:</span>
                        <span>RWF {formData.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('rra.vat18')}:</span>
                        <span>RWF {formData.vat.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('rra.rraTax1')}:</span>
                        <span>RWF {formData.rraTax.toLocaleString()}</span>
                      </div>
                      {paymentData && (
                        <div className="flex justify-between">
                          <span>{t('rra.deliveryMethod')}:</span>
                          <span>{paymentData.deliveryMethod}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-1 text-[#ff6600] dark:text-[#ff6600]">
                        <span>{t('rra.totalPaid')}:</span>
                        <span>RWF {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {t('rra.thankYou')}
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
              {t('common.back')}
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
                  {step === 1 ? t('electricity.validating') : t('electricity.processing')}
                </>
              ) : (
                <>
                  {t('common.next')}
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
                  {t('rra.processingPayment')}
                </>
              ) : (
                <>
                  {t('rra.confirmPayment')}
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
                {t('electricity.downloadReceipt')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full text-center font-semibold"
              >
                {t('rra.newPayment')}
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

// Input component with error handling
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