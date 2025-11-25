'use client';

/**
 * EXAMPLE USAGE OF PROFESSIONAL RECEIPT COMPONENT
 * 
 * This file demonstrates how to use the ProfessionalReceipt component
 * in your payment services (RRA, Electricity, Airtime, etc.)
 */

import React, { useState } from 'react';
import ProfessionalReceipt from './ProfessionalReceipt';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

export default function ReceiptExample() {
  const [showReceipt, setShowReceipt] = useState(false);

  // Example 1: Airtime Payment Receipt
  const airtimeReceiptData = {
    transactionId: 'TXN20250125ABC123',
    receiptId: 'RCP-AIR-2025-001',
    date: new Date(),
    status: 'successful' as const,
    serviceName: 'Airtime Purchase',
    serviceDescription: 'Mobile Airtime Top-up',
    customerName: 'John Doe',
    customerPhone: '+250 788 123 456',
    customerReference: '0788123456',
    agentName: 'Agent Smith',
    agentId: 'AGT-001',
    agentPhone: '+250 788 999 888',
    amount: 5000,
    serviceFee: 100,
    vat: 18,
    tax: 0,
    totalAmount: 5118,
    currency: 'RWF',
    additionalInfo: [
      { label: 'Network Provider', value: 'MTN Rwanda' },
      { label: 'Payment Method', value: 'Momo Pay' },
      { label: 'Airtime Type', value: 'Prepaid' }
    ],
    customNote: 'Airtime has been credited to your account successfully.'
  };

  // Example 2: Electricity Payment Receipt
  const electricityReceiptData = {
    transactionId: 'TXN20250125XYZ789',
    receiptId: 'RCP-ELEC-2025-002',
    date: new Date(),
    status: 'successful' as const,
    serviceName: 'Electricity Payment',
    serviceDescription: 'EUCL Electricity Token Purchase',
    customerName: 'Jane Smith',
    customerPhone: '+250 788 654 321',
    customerReference: '04101234567890',
    amount: 10000,
    serviceFee: 200,
    vat: 36,
    tax: 50,
    totalAmount: 10286,
    currency: 'RWF',
    additionalInfo: [
      { label: 'Meter Number', value: '04101234567890' },
      { label: 'Token', value: '1234-5678-9012-3456-7890' },
      { label: 'Units', value: '125 kWh' },
      { label: 'Tariff Category', value: 'Residential' }
    ],
    customNote: 'Your electricity token has been generated. Please enter it on your meter.'
  };

  // Example 3: RRA Tax Payment Receipt
  const rraReceiptData = {
    transactionId: 'TXN20250125RRA456',
    receiptId: 'RCP-RRA-2025-003',
    date: new Date(),
    status: 'successful' as const,
    serviceName: 'RRA Tax Payment',
    serviceDescription: 'Rwanda Revenue Authority Tax Payment',
    customerName: 'ABC Company Ltd',
    customerPhone: '+250 788 111 222',
    customerEmail: 'finance@abccompany.rw',
    customerReference: '123456789',
    amount: 50000,
    serviceFee: 500,
    vat: 90,
    tax: 250,
    totalAmount: 50840,
    currency: 'RWF',
    additionalInfo: [
      { label: 'TIN Number', value: '123456789' },
      { label: 'Tax Type', value: 'Corporate Income Tax' },
      { label: 'Tax Period', value: 'Q4 2024' },
      { label: 'Payment Reference', value: 'RRA-2025-Q4-001' }
    ],
    customNote: 'Tax payment successfully processed. Please retain this receipt for your records.'
  };

  // Download Receipt as PDF
  const downloadReceipt = () => {
    const element = document.getElementById('receipt');
    if (!element) return;

    const options = {
      margin: 10,
      filename: `receipt_${airtimeReceiptData.receiptId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#13294b] dark:text-white mb-8 text-center">
          Professional Receipt Examples
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowReceipt(true)}
            className="p-6 bg-white dark:bg-gray-900 rounded-xl border-2 border-[#ff6600] hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-bold text-[#ff6600] mb-2">Airtime Receipt</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View example airtime purchase receipt
            </p>
          </button>

          <button className="p-6 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-300 hover:border-[#ff6600] hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-[#13294b] dark:text-white mb-2">Electricity Receipt</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View example electricity payment receipt
            </p>
          </button>

          <button className="p-6 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-300 hover:border-[#ff6600] hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-[#13294b] dark:text-white mb-2">RRA Receipt</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View example tax payment receipt
            </p>
          </button>
        </div>

        {showReceipt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Receipt Component */}
            <ProfessionalReceipt {...airtimeReceiptData} />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadReceipt}
                className="px-6 py-3 bg-[#ff6600] text-white rounded-lg font-semibold hover:bg-[#e65c00] transition-all shadow-lg"
              >
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-[#13294b] text-white rounded-lg font-semibold hover:bg-[#0f1f35] transition-all shadow-lg"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* Usage Instructions */}
        <div className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-[#13294b] dark:text-white mb-4">
            How to Use in Your Services
          </h2>
          
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-[#ff6600] mb-2">Step 1: Import the Component</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
{`import ProfessionalReceipt from '@/components/ProfessionalReceipt';`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-[#ff6600] mb-2">Step 2: Prepare Your Data</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-xs">
{`const receiptData = {
  transactionId: 'TXN123456',
  receiptId: 'RCP-001',
  date: new Date(),
  status: 'successful',
  serviceName: 'Your Service Name',
  customerName: 'Customer Name',
  amount: 10000,
  totalAmount: 10500,
  // ... other fields
};`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-[#ff6600] mb-2">Step 3: Render the Component</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
{`<ProfessionalReceipt {...receiptData} />`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-[#ff6600] mb-2">Step 4: Add Download/Print Functionality</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-xs">
{`const downloadReceipt = () => {
  const element = document.getElementById('receipt');
  html2pdf().set(options).from(element).save();
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
