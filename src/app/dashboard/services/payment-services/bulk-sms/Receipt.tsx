'use client';

import html2pdf from 'html2pdf.js';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n-context';

export default function Receipt({ receiptId, recipients, message, cost, total,senderId }: any) {
  const { t } = useTranslation();
  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt-pdf');
    if (element) {
      html2pdf().from(element).save(`bulk_sms_${receiptId}.pdf`);
    }
  };

  return (
    <div className="space-y-4">
      <div
        id="receipt-pdf"
        className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700"
      >
        <h2 className="text-xl font-bold">{t('bulkSms.bulkSmsReceipt')}</h2>
        <p>{t('bulkSms.receiptId')}: {receiptId}</p>
        <p>{t('bulkSms.recipients')}: {recipients.length}</p>
        <p>{t('bulkSms.senderId')}: {senderId || 'N/A'}</p>

        <p>{t('bulkSms.yourMessage')}: {message}</p>
        <p>{t('bulkSms.costPerMessage')}: {cost} RWF</p>
        <p className="font-bold">{t('bulkSms.totalCost')}: {total} RWF</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
        >
          {t('electricity.downloadReceipt')}
        </button>
        <Link
          href="/dashboard/services"
          className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-xl text-center"
        >
          {t('common.back')}
        </Link>
      </div>
    </div>
  );
}
