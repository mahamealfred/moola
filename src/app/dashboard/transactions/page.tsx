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
  { id: 'TX1004', date: '2025-07-03', service: 'Electricity', status: 'Failed', amount: 75.25, recipient: 'Emily Davis' },
  { id: 'TX1005', date: '2025-07-03', service: 'RRA', status: 'Completed', amount: 300.0, recipient: 'Michael Brown' },
  { id: 'TX1006', date: '2025-07-04', service: 'Electricity', status: 'Completed', amount: 90.0, recipient: 'Sarah Wilson' },
  { id: 'TX1007', date: '2025-07-04', service: 'Airtime', status: 'Pending', amount: 5.0, recipient: 'Chris Lee' },
  { id: 'TX1008', date: '2025-07-05', service: 'Water', status: 'Completed', amount: 60.0, recipient: 'Anna Moore' },
  { id: 'TX1009', date: '2025-07-05', service: 'RRA', status: 'Completed', amount: 180.0, recipient: 'Daniel White' },
  { id: 'TX1010', date: '2025-07-06', service: 'Electricity', status: 'Failed', amount: 110.0, recipient: 'Laura Clark' },
  { id: 'TX1011', date: '2025-07-06', service: 'Airtime', status: 'Completed', amount: 8.0, recipient: 'James Lewis' },
  { id: 'TX1012', date: '2025-07-07', service: 'Water', status: 'Completed', amount: 52.0, recipient: 'Sophia Walker' },
  { id: 'TX1013', date: '2025-07-07', service: 'RRA', status: 'Pending', amount: 250.0, recipient: 'Jacob Hall' },
  { id: 'TX1014', date: '2025-07-08', service: 'Electricity', status: 'Completed', amount: 130.0, recipient: 'Grace Allen' },
  { id: 'TX1015', date: '2025-07-08', service: 'Airtime', status: 'Completed', amount: 12.5, recipient: 'Ethan Young' },
  { id: 'TX1016', date: '2025-07-09', service: 'Water', status: 'Failed', amount: 70.0, recipient: 'Olivia Hernandez' },
  { id: 'TX1017', date: '2025-07-09', service: 'Electricity', status: 'Pending', amount: 115.0, recipient: 'Liam King' },
  { id: 'TX1018', date: '2025-07-10', service: 'RRA', status: 'Completed', amount: 200.0, recipient: 'Ava Wright' },
  { id: 'TX1019', date: '2025-07-10', service: 'Airtime', status: 'Completed', amount: 15.0, recipient: 'Mason Scott' },
  { id: 'TX1020', date: '2025-07-11', service: 'Electricity', status: 'Completed', amount: 95.0, recipient: 'Chloe Green' },
  { id: 'TX1021', date: '2025-07-11', service: 'Water', status: 'Completed', amount: 65.0, recipient: 'Benjamin Adams' },
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
