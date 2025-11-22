'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-context';
import CSVUpload from './CSVUpload';
import RecipientList from './RecipientList';
import MessageForm from './MessageForm';
import Confirmation from './Confirmation';
import Receipt from './Receipt';

export default function BulkSmsForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [recipients, setRecipients] = useState<{ name: string; phone: string }[]>([]);
  const [message, setMessage] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [senderId, setSenderId] = useState('');

  const messageCost = message.length > 160 ? 30 : 15;
  const totalCost = recipients.length * messageCost;

  const handleNext = () => {
    if (step === 3) {
      setReceiptId('SMS' + Date.now());
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700"
      >
        {/* Bulk SMS Header with Same Colors */}
        <div className="mb-4 md:mb-5 text-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#ff6600] dark:text-[#ff6600]">{t('bulkSms.title')}</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('bulkSms.subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-5">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
            {[1, 2, 3, 4, 5].map((i) => (
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
            <span>{t('bulkSms.upload')}</span>
            <span>{t('bulkSms.recipients')}</span>
            <span>{t('bulkSms.message')}</span>
            <span>{t('common.confirm')}</span>
            <span>{t('forms.receipt')}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="upload" {...stepAnim}>
              <CSVUpload onUpload={setRecipients} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="list" {...stepAnim}>
              <RecipientList recipients={recipients} setRecipients={setRecipients} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="message" {...stepAnim}>
              <MessageForm message={message} setMessage={setMessage} senderId={senderId} setSenderId={setSenderId} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="confirm" {...stepAnim}>
              <Confirmation
                recipients={recipients}
                message={message}
                cost={messageCost}
                total={totalCost}
              />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="receipt" {...stepAnim}>
              <Receipt
                receiptId={receiptId}
                recipients={recipients}
                message={message}
                cost={messageCost}
                total={totalCost}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-4 md:mt-5 flex flex-col-reverse sm:flex-row gap-2 md:gap-3 justify-between items-center">
          {step > 1 && step < 5 && (
            <button
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-300 hover:underline py-1.5 px-3 md:py-2 md:px-4 rounded text-sm md:text-base w-full sm:w-auto text-center flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('common.back')}
            </button>
          )}

          {step < 4 && (
            <button
              onClick={handleNext}
              disabled={recipients.length === 0}
              className="bg-[#ff6600] hover:bg-[#e65c00] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full sm:w-auto font-semibold transition flex items-center justify-center ml-auto"
            >
              {t('common.next')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleNext}
              className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full sm:w-auto font-semibold flex items-center justify-center ml-auto"
            >
              {t('common.confirm')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const stepAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};