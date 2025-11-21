'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n-context';

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  
  // Normalize status to lowercase for consistent mapping
  const normalizedStatus = status.toLowerCase();
  
  const statusColor = {
    successful: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  };
  
  const statusText = {
    successful: t('transactions.successful'),
    pending: t('transactions.pending'),
    failed: t('transactions.failed'),
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
        statusColor[normalizedStatus as keyof typeof statusColor] || 
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
      }`}
    >
      {statusText[normalizedStatus as keyof typeof statusText] || status}
    </span>
  );
}