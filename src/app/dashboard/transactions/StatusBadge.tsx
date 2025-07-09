'use client';

import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  const statusColor = {
    Completed: 'bg-green-100 text-green-700 border-green-300',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Failed: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <span
      className={`text-sm font-medium px-3 py-1 rounded-full border ${statusColor[status as keyof typeof statusColor] || 'bg-gray-100 text-gray-700 border-gray-300'}`}
    >
      {status}
    </span>
  );
}
