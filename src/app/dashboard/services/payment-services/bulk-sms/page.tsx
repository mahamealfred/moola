'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CSVUpload from './CSVUpload';
import RecipientList from './RecipientList';
import MessageForm from './MessageForm';
import Confirmation from './Confirmation';
import Receipt from './Receipt';

export default function BulkSmsForm() {
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
    <div >
 <motion.div
      className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg p-6 rounded-2xl border dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            <MessageForm message={message} setMessage={setMessage} senderId={senderId}
  setSenderId={setSenderId} />
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

      <div className="flex justify-between items-center mt-6">
        {step > 1 && step < 5 && (
          <button onClick={handleBack} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
            ← Back
          </button>
        )}

        {step < 4 && (
          <button
            onClick={handleNext}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
          >
            Next
          </button>
        )}

        {step === 4 && (
          <button
            onClick={handleNext}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
          >
            Confirm & Generate Receipt
          </button>
        )}
      </div>
    </motion.div>
    </div>
   
  );
}

const stepAnim = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};
