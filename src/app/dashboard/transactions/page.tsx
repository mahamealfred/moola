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
  { id: 'TX1001', date: '2025-07-01', service: 'Electricity', status: 'Completed', amount: 120.0, recipient: 'John Doe' },
  { id: 'TX1002', date: '2025-07-02', service: 'Water', status: 'Pending', amount: 45.5, recipient: 'Jane Smith' },
  { id: 'TX1003', date: '2025-07-02', service: 'Airtime', status: 'Completed', amount: 10.0, recipient: 'Alex Johnson' },
  // ... add other sample data
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
        className="text-[#ff6600] hover:underline flex items-center gap-1"
      >
        <FiPrinter /> Print
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
  doc.save(`Receipt_${tx.id}.pdf`);
};

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
    <div className="p-4 md:p-6 min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Filter & Export */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search transactions..."
          className="border rounded-xl px-4 py-2 w-full md:max-w-md focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
        />
        <CSVLink
          data={table.getFilteredRowModel().rows.map((r) => r.original)}
          filename="transactions.csv"
          className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-5 py-2 rounded-xl transition"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto bg-white/70 dark:bg-black/40 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-4"
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left text-gray-800 dark:text-gray-200 font-semibold"
                  >
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
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}
