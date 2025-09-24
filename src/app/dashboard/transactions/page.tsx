'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  FilterFn,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiPrinter, FiSearch, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  { id: 'TX1004', date: '2025-07-03', service: 'RRA Tax', status: 'Completed', amount: 250.0, recipient: 'Rwanda Revenue Authority' },
  { id: 'TX1005', date: '2025-07-03', service: 'Startime', status: 'Failed', amount: 35.0, recipient: 'David Wilson' },
  { id: 'TX1006', date: '2025-07-04', service: 'School Fees', status: 'Completed', amount: 500.0, recipient: 'Green Hills Academy' },
  { id: 'TX1007', date: '2025-07-04', service: 'EcoBank Deposit', status: 'Pending', amount: 1000.0, recipient: 'EcoBank Rwanda' },
  { id: 'TX1008', date: '2025-07-05', service: 'Express Token', status: 'Completed', amount: 75.0, recipient: 'Maria Hernandez' },
];

// Custom filter function that searches across all string values
const globalFilterFn: FilterFn<Transaction> = (row, columnId, filterValue) => {
  const search = filterValue.toLowerCase();
  
  return (
    row.original.id.toLowerCase().includes(search) ||
    row.original.date.toLowerCase().includes(search) ||
    row.original.service.toLowerCase().includes(search) ||
    row.original.status.toLowerCase().includes(search) ||
    row.original.recipient.toLowerCase().includes(search) ||
    row.original.amount.toString().includes(search)
  );
};

const helper = createColumnHelper<Transaction>();

const columns = [
  helper.accessor('id', { 
    header: 'Tx ID',
    cell: (info) => (
      <span className="font-mono text-xs sm:text-sm">{info.getValue()}</span>
    ),
    size: 100, // Fixed width for ID column
  }),
  helper.accessor('date', { 
    header: 'Date',
    cell: (info) => (
      <span className="whitespace-nowrap text-xs sm:text-sm">{info.getValue()}</span>
    ),
    size: 110, // Fixed width for Date column
  }),
  helper.accessor('service', { 
    header: 'Service',
    cell: (info) => (
      <span className="truncate block text-xs sm:text-sm">{info.getValue()}</span>
    ),
    size: 120, // Fixed width for Service column
  }),
  helper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
    size: 100, // Fixed width for Status column
  }),
  helper.accessor('amount', {
    header: 'Amount (RWF)',
    cell: (info) => (
      <span className="font-medium whitespace-nowrap text-xs sm:text-sm">
        {info.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    ),
    size: 120, // Fixed width for Amount column
  }),
  helper.accessor('recipient', { 
    header: 'Recipient',
    cell: (info) => (
      <span className="truncate block text-xs sm:text-sm">{info.getValue()}</span>
    ),
    size: 150, // Fixed width for Recipient column
  }),
  helper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        onClick={() => printPDF(row.original)}
        className="text-[#ff6600] hover:underline flex items-center gap-1 text-xs sm:text-sm"
        title="Print Receipt"
      >
        <FiPrinter className="text-xs sm:text-sm" /> 
        <span className="hidden xs:inline">Print</span>
      </button>
    ),
    size: 80, // Fixed width for Actions column
  }),
];

const printPDF = (tx: Transaction) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Transaction Receipt - ${tx.id}`, 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['Field', 'Value']],
    body: [
      ['Transaction ID', tx.id],
      ['Date', tx.date],
      ['Service', tx.service],
      ['Status', tx.status],
      ['Amount', `RWF ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Recipient', tx.recipient],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [255, 102, 0],
      textColor: 255
    },
  });
  doc.save(`Receipt_${tx.id}.pdf`);
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState('');
  const [data] = useState(sampleData);

  const table = useReactTable({
    data,
    columns,
    state: { 
      globalFilter: filter,
      pagination: {
        pageSize: 8, // Increased for better mobile experience
        pageIndex: 0,
      }
    },
    onGlobalFilterChange: setFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-950 transition-colors w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">View and manage your payment transactions</p>
      </div>

      {/* Filter & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search transactions..."
            className="border rounded-lg sm:rounded-xl pl-9 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ff6600] dark:bg-gray-800 dark:text-white dark:border-gray-700 text-sm sm:text-base"
          />
        </div>
        <CSVLink
          data={table.getFilteredRowModel().rows.map((r) => r.original)}
          filename="transactions.csv"
          className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
        >
          <FiDownload className="text-sm" />
          <span>Export CSV</span>
        </CSVLink>
      </div>

      {/* Results count */}
      {filter && (
        <div className="mb-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {table.getFilteredRowModel().rows.length} transaction(s) found
        </div>
      )}

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto bg-white/70 dark:bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 w-full"
      >
        {/* Remove the fixed min-width div and let table be fully responsive */}
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-2 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    style={{ 
                      width: `${h.getSize()}px`,
                      minWidth: `${h.getSize()}px`,
                      maxWidth: `${h.getSize()}px`
                    }}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className="px-2 py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
                      style={{ 
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No transactions found. Try a different search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {table.getFilteredRowModel().rows.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} entries
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center gap-1"
              title="Previous page"
            >
              <FiChevronLeft className="text-sm" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 px-2">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center gap-1"
              title="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile-friendly alternative view for very small screens */}
      <div className="block lg:hidden mt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Scroll horizontally to view all columns →
        </div>
      </div>
    </div>
  );
}