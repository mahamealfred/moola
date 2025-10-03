'use client';

import html2pdf from 'html2pdf.js';

interface Recipient {
  phone: string;
  amount: number;
}

interface ReceiptProps {
  receiptId: string;
  recipients: Recipient[];
  total: number;
}

export default function Receipt({ receiptId, recipients, total }: ReceiptProps) {
  const downloadPDF = () => {
    const element = document.getElementById('airtime-receipt');
    if (element) {
      const opt = {
        margin: 0.5,
        filename: `airtime_transfer_${receiptId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">Airtime Sent Successfully</h2>
      <div
        id="airtime-receipt"
        className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
      >
        <div className="text-center mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-600 pb-2 md:pb-3">
          <div className="flex items-center justify-center space-x-1 md:space-x-2">
            <div className="bg-[#ff6600] text-white p-1.5 md:p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-md md:text-lg font-bold text-[#ff6600] dark:text-[#ff6600]">Bulk Airtime Receipt</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Airtime Transfer Confirmation</p>
        </div>
        
        <div className="space-y-2 md:space-y-3 text-sm md:text-base">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div>
              <p>
                <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Receipt ID</strong>
                {receiptId}
              </p>
              <p className="mt-1 md:mt-2">
                <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Date</strong>
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p>
                <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Recipients</strong>
                {recipients.length}
              </p>
              <p className="mt-1 md:mt-2">
                <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Transaction Type</strong>
                Bulk Airtime Transfer
              </p>
            </div>
          </div>

          <div className="bg-[#ff660010] dark:bg-[#ff660020] p-2 md:p-3 rounded">
            <h4 className="font-semibold text-[#ff6600] dark:text-[#ff6600] mb-1 text-sm md:text-base">Transaction Details</h4>
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>Total Recipients:</span>
                <span>{recipients.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>RWF {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1 text-[#ff6600] dark:text-[#ff6600]">
                <span>Total Transferred:</span>
                <span>RWF {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#ff660010] dark:bg-[#ff660020] p-2 md:p-3 rounded">
            <h4 className="font-semibold text-[#ff6600] dark:text-[#ff6600] mb-1 text-sm md:text-base">Recipients List</h4>
            <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
              {recipients.map((recipient, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <span className="truncate">{recipient.phone}</span>
                  <span className="font-medium">RWF {recipient.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Airtime has been successfully transferred to all recipients. They will receive confirmation messages shortly.
          </p>
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
            ID: {receiptId} | {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full mt-4">
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
          New Airtime Transfer
        </button>
      </div>
    </div>
  );
}