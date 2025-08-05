'use client';

import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';

const stepAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

type FormData = {

  identityNo: string;
  firstname: string;
  lastname: string;
  middlename?: string | null;
  dateOfBirth: string;
  idIssueDate: string;
  idExpiryDate: string;
  mobileNo: string;
  email: string;
  gender: string;
  receiptId: string;
};

export default function OpenAccount() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    identityNo: '',
    firstname: '',
    lastname: '',
    middlename: '',
    dateOfBirth: '',
    idIssueDate: '',
    idExpiryDate: '',
    mobileNo: '',
    email: '',
    gender: '',
    receiptId: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.identityNo ) return;
      setLoading(true);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          firstname: 'Alfred',
          lastname: 'Mahame',
          middlename: null,
          dateOfBirth: '1991-02-05',
          idIssueDate: '2021-05-18',
          idExpiryDate: '2030-05-20',
          mobileNo: '250789595309',
          email: 'mahamealfred@gmail.com',
          gender: 'MALE',
        }));
        setStep(2);
        setLoading(false);
      }, 1000);
    } else if (step === 2) {
      const id = 'REC' + Date.now();
      setFormData((prev) => ({ ...prev, receiptId: id }));
      setStep(3);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt');
    if (element) {
      html2pdf().from(element).save(`open_account_${formData.receiptId}.pdf`);
    }
  };

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
            
              <Input
                label="Identity Number"
                name="identityNo"
                value={formData.identityNo}
                onChange={handleChange}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Name:</strong> {formData.firstname} {formData.middlename} {formData.lastname}</p>
                <p><strong>DOB:</strong> {formData.dateOfBirth}</p>
                <p><strong>Mobile:</strong> {formData.mobileNo}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Issued:</strong> {formData.idIssueDate}</p>
                <p><strong>Expires:</strong> {formData.idExpiryDate}</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <div id="receipt" className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl text-sm space-y-2">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Account Opened</h2>
                <p><strong>Receipt ID:</strong> {formData.receiptId}</p>
                <p><strong>Full Name:</strong> {formData.firstname} {formData.lastname}</p>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          {step > 1 && step < 3 && (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              ← Back
            </button>
          )}

          {step < 2 && (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Next'}
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition"
            >
              Confirm
            </button>
          )}

          {step === 3 && (
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

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const Input: React.FC<InputProps> = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="w-full space-y-1 mb-4">
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
