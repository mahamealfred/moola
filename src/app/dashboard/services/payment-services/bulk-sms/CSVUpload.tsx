'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from '@/lib/i18n-context';

interface CSVUploadProps {
  onUpload: (recipients: { name: string; phone: string }[]) => void;
}

export default function CSVUpload({ onUpload }: CSVUploadProps) {
  const { t } = useTranslation();
  const downloadTemplate = () => {
    const csvContent = "name,phone\nJohn Doe,+250788123456\nJane Smith,+250789987654\nAlice Uwase,+250783456789";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sms_recipients_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const recipients = lines.slice(1) // Skip header
        .filter(line => line.trim())
        .map(line => {
          const [name, phone] = line.split(',');
          return { name: name?.trim() || '', phone: phone?.trim() || '' };
        })
        .filter(recipient => recipient.phone);
      
      onUpload(recipients);
    };
    
    reader.readAsText(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">{t('bulkSms.uploadRecipients')}</h2>
      
      {/* Template Download Section */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">{t('bulkSms.downloadTemplate')}</h3>
            <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
              {t('bulkSms.templateInfo')}
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('bulkSms.downloadBtn')}
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-[#ff6600] bg-[#ff660010]'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
        }`}
      >
        <input {...getInputProps()} />
        <div className="bg-[#ff6600] text-white p-2 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          {isDragActive ? t('bulkSms.dropFile') : t('bulkSms.dragDrop')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('bulkSms.csvFormat')}
        </p>
      </div>

      {/* CSV Format Instructions */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{t('bulkSms.formatRequirements')}</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• {t('bulkSms.requirement1')}</li>
          <li>• {t('bulkSms.requirement2')}</li>
          <li>• {t('bulkSms.requirement3')}</li>
          <li>• {t('bulkSms.requirement4')}</li>
        </ul>
      </div>
    </div>
  );
}