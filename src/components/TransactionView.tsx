'use client'

import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  FilterFn,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { CSVLink } from 'react-csv'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FiEye, FiPrinter, FiUser } from 'react-icons/fi'

interface Transaction {
  transactionId: string
  date: string
  serviceName: string
  status: 'Completed' | 'Pending' | 'Failed' | string
  amount: number
}

const columnHelper = createColumnHelper<Transaction>()

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = 'bg-gray-300 text-gray-700'

  switch (status.toLowerCase()) {
    case 'completed':
      colorClass = 'bg-green-100 text-green-800'
      break
    case 'pending':
      colorClass = 'bg-yellow-100 text-yellow-800'
      break
    case 'failed':
      colorClass = 'bg-red-100 text-red-800'
      break
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${colorClass}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  )
}

const columns: ColumnDef<Transaction>[] = [
  columnHelper.accessor('transactionId', {
    header: 'Transaction ID',
  }),
  columnHelper.accessor('date', {
    header: 'Date',
  }),
  columnHelper.accessor('serviceName', {
    header: 'Service Name',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: info => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.display({
    id: 'user',
    header: 'User',
    cell: () => <FiUser className="inline text-blue-500" />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setSelectedTransaction(row.original)}
          title="View"
        >
          <FiEye />
        </button>
        <button
          className="text-green-600 hover:text-green-800"
          onClick={() => window.print()}
          title="Print"
        >
          <FiPrinter />
        </button>
      </div>
    ),
  }),
]

const data: Transaction[] = [
  {
    transactionId: 'TX12345',
    date: '2025-07-09',
    serviceName: 'Electricity Payment',
    status: 'Completed',
    amount: 150.0,
  },
  {
    transactionId: 'TX12346',
    date: '2025-07-08',
    serviceName: 'Water Bill',
    status: 'Pending',
    amount: 75.5,
  },
  {
    transactionId: 'TX12347',
    date: '2025-07-07',
    serviceName: 'Internet',
    status: 'Failed',
    amount: 60.0,
  },
]

const fuzzyFilter: FilterFn<Transaction> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId)
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
}

// make sure setSelectedTransaction is lifted into scope
let setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>

export default function DataTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedTx, _setSelectedTransaction] = useState<Transaction | null>(null)
  setSelectedTransaction = _setSelectedTransaction

  const table = useReactTable<Transaction>({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const exportPDF = () => {
    const doc = new jsPDF()
    const exportCols = columns.filter(col => !['user', 'actions'].includes(col.id ?? ''))
    const head = [exportCols.map(col => (typeof col.header === 'string' ? col.header : ''))]
    const body = table.getFilteredRowModel().rows.map(row =>
      exportCols.map(col => {
        const val = row.getValue(col.id as keyof Transaction)
        return col.id === 'amount' && typeof val === 'number' ? `$${val.toFixed(2)}` : String(val ?? '')
      }),
    )

    autoTable(doc, { head, body, startY: 20 })
    doc.save('transactions.pdf')
  }

  return (
    <div className="p-4">
      {/* Filter + Export Buttons */}
      {/* ... UI from your original post remains unchanged ... */}

      {/* Render Table */}
      {/* ... Render Table logic from your original post ... */}

      {/* Pagination */}
      {/* ... Pagination logic from your original post ... */}

      {/* Modal View */}
      {/* You can define <TransactionView /> separately */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
            <p><strong>ID:</strong> {selectedTx.transactionId}</p>
            <p><strong>Date:</strong> {selectedTx.date}</p>
            <p><strong>Service:</strong> {selectedTx.serviceName}</p>
            <p><strong>Status:</strong> {selectedTx.status}</p>
            <p><strong>Amount:</strong> ${selectedTx.amount.toFixed(2)}</p>
            <button
              onClick={() => _setSelectedTransaction(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
