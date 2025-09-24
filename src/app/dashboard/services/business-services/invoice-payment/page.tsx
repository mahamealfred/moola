'use client';

import React, { useState } from 'react';

export default function InvoicePayment() {
  const [invoices,] = useState([
    { id: 'INV-001', client: 'Client A', amount: 250000, dueDate: '2024-01-15', status: 'Pending' },
    { id: 'INV-002', client: 'Client B', amount: 180000, dueDate: '2024-01-20', status: 'Paid' },
    { id: 'INV-003', client: 'Client C', amount: 320000, dueDate: '2024-01-25', status: 'Pending' },
  ]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Invoice Payments</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Create New Invoice</label>
            <button className="w-full bg-[#13294b] text-white py-2 rounded hover:bg-[#1a3a6b] transition-colors">
              + New Invoice
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quick Payment</label>
            <button className="w-full bg-[#ff6600] text-white py-2 rounded hover:bg-[#e55a00] transition-colors">
              Pay Invoice
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <h4 className="font-medium p-4 border-b">Recent Invoices</h4>
          <div className="divide-y">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-sm text-gray-600">{invoice.client}</div>
                </div>
                <div className="text-right">
                  <div>RWF {invoice.amount.toLocaleString()}</div>
                  <div className={`text-xs ${invoice.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {invoice.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}