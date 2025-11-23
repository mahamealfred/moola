'use client';

import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Link from 'next/link';

type FormData = {
  receiveraccount: string;
  destination: string;
  receiverfirstname: string;
  receiverlastname: string;
  senderfirstname: string;
  senderlastname: string;
  thirdpartyphonenumber: string;
  receivermobile: string;
  deliverymode: string;
  amount: string;
  idtype: string;
  idnumber: string;
  address: string;
  securityquestion: string;
  securityanswer: string;
  email: string;
  narration: string;
};

export default function RemittanceForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    receiveraccount: '',
    destination: '',
    receiverfirstname: '',
    receiverlastname: '',
    senderfirstname: '',
    senderlastname: '',
    thirdpartyphonenumber: '',
    receivermobile: '',
    deliverymode: 'CASH',
    amount: '',
    idtype: 'PP',
    idnumber: '',
    address: '',
    securityquestion: '',
    securityanswer: '',
    email: '',
    narration: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && formData.receiveraccount && formData.destination) {
      setFormData(prev => ({
        ...prev,
        receiverfirstname: 'Eugene',
        receiverlastname: 'Ansah',
      }));
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt');
    if (element) html2pdf().from(element).save(`remittance_receipt.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Destination Country" name="destination" value={formData.destination} onChange={handleChange} />
              <Input label="Receiver Account Number" name="receiveraccount" value={formData.receiveraccount} onChange={handleChange} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Receiver First Name" name="receiverfirstname" value={formData.receiverfirstname} onChange={handleChange} />
              <Input label="Receiver Last Name" name="receiverlastname" value={formData.receiverlastname} onChange={handleChange} />
              <Input label="Sender First Name" name="senderfirstname" value={formData.senderfirstname} onChange={handleChange} />
              <Input label="Sender Last Name" name="senderlastname" value={formData.senderlastname} onChange={handleChange} />
              <Input label="Sender Phone" name="thirdpartyphonenumber" value={formData.thirdpartyphonenumber} onChange={handleChange} />
              <Input label="Receiver Mobile" name="receivermobile" value={formData.receivermobile} onChange={handleChange} />
              <Input label="Delivery Mode" name="deliverymode" value={formData.deliverymode} onChange={handleChange} />
              <Input label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} />
              <Input label="ID Type" name="idtype" value={formData.idtype} onChange={handleChange} />
              <Input label="ID Number" name="idnumber" value={formData.idnumber} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
              <Input label="Security Question" name="securityquestion" value={formData.securityquestion} onChange={handleChange} />
              <Input label="Security Answer" name="securityanswer" value={formData.securityanswer} onChange={handleChange} />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <Input label="Narration" name="narration" value={formData.narration} onChange={handleChange} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...stepAnimation}>
              <div id="receipt" className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl text-sm space-y-2">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Remittance Summary</h2>
                {Object.entries(formData).map(([key, value]) => (
                  <p key={key}><strong>{key}</strong>: {value}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          {step > 1 && step < 3 && (
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
              className="w-full sm:w-auto bg-[#13294b] hover:bg-[#0f213d] dark:bg-[#ff6600] dark:hover:bg-[#ff8c00] text-white font-semibold px-6 py-2 rounded-xl transition"
            >
              Next
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

const stepAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
