'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiPrinter } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

interface Transaction {
  id: string;
  date: string;
  service: string;
  status: 'Completed' | 'Pending' | 'Failed';
  amount: number;
  recipient: string;
}

const sampleData: Transaction[] = [
  {
    id: 'TX1001',
    date: '2025-07-01',
    service: 'Electricity',
    status: 'Completed',
    amount: 120.0,
    recipient: 'John Doe',
  },
  // ... more sample
];

const helper = createColumnHelper<Transaction>();

const columns = [
  helper.accessor('id', { header: 'Tx ID' }),
  helper.accessor('date', { header: 'Date' }),
  helper.accessor('service', { header: 'Service' }),
  helper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  helper.accessor('amount', {
    header: 'Amount (RWF)',
    cell: (info) => info.getValue().toFixed(2),
  }),
  helper.accessor('recipient', { header: 'Recipient' }),
  helper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        onClick={() => printPDF(row.original)}
        className="text-blue-600 hover:underline flex items-center"
      >
        <FiPrinter className="mr-1" /> Print
      </button>
    ),
  }),
];

const printPDF = (tx: Transaction) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Transaction Receipt ${tx.id}`, 20, 20);
  autoTable(doc, {
    startY: 30,
    body: [
      ['ID', tx.id],
      ['Date', tx.date],
      ['Service', tx.service],
      ['Status', tx.status],
      ['Amount (RWF)', tx.amount.toFixed(2)],
      ['Recipient', tx.recipient],
    ],
  });
  const qrData = {
    id: tx.id,
    date: tx.date,
    amount: tx.amount,
    service: tx.service,
  };
  doc.addPage();
  doc.setFontSize(14);
  doc.text('QR Code to verify', 20, 20);
}
  
  
export default function TransactionsPage() {
  const [filter, setFilter] = useState('');
  const [data] = useState(sampleData);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search transactions..."
          className="border rounded px-4 py-2 flex-grow max-w-md"
        />
        <CSVLink
          data={table.getFilteredRowModel().rows.map((r) => r.original)}
          filename="transactions.csv"
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </CSVLink>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-2 border">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}
