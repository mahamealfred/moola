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
import { FiUser, FiEye, FiPrinter } from 'react-icons/fi'

// Mocked TransactionView component — replace with your actual component
const TransactionView = ({ transaction, onClose }: { transaction: Transaction; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
      <pre className="text-sm">{JSON.stringify(transaction, null, 2)}</pre>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
)

// Transaction type
interface Transaction {
  transactionId: string
  date: string
  serviceName: string
  status: 'Completed' | 'Pending' | 'Failed' | string
  amount: number
}

// Dummy Data
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

// Fuzzy filter
const fuzzyFilter: FilterFn<Transaction> = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId)
  return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase())
}

// Status badge
function StatusBadge({ status }: { status: string }) {
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

// Columns
const columnHelper = createColumnHelper<Transaction>()
const columns: ColumnDef<Transaction>[] = [
  columnHelper.accessor('transactionId', { header: 'Transaction ID' }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('serviceName', { header: 'Service Name' }),
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
          type="button"
        >
          <FiEye />
        </button>
        <button
          className="text-green-600 hover:text-green-800"
          onClick={() => window.print()}
          title="Print"
          type="button"
        >
          <FiPrinter />
        </button>
      </div>
    ),
  }),
]

// Component
export default function DataTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const table = useReactTable({
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
        if (col.id === 'amount' && typeof val === 'number') return `$${val.toFixed(2)}`
        if (val == null) return ''
        return String(val)
      }),
    )

    autoTable(doc, { head, body, startY: 20 })
    doc.save('transactions.pdf')
  }

  return (
    <div className="p-4">
      {/* Filters & Export Buttons */}
      <div className="flex flex-col md:flex-row justify-between mb-4 items-center gap-2">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search transactions..."
          className="border rounded px-3 py-2 w-full max-w-md"
          aria-label="Search transactions"
        />

        <div className="flex gap-2">
          <CSVLink
            data={table.getFilteredRowModel().rows.map(row => row.original)}
            filename={'transactions.csv'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
          >
            Export CSV
          </CSVLink>

          <button
            onClick={exportPDF}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 whitespace-nowrap"
            type="button"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow-md border border-gray-300">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200 text-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No results found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 flex-wrap">
        <div>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 mr-2 rounded bg-gray-300 disabled:opacity-50"
            type="button"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
            type="button"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>

      {/* Modal View */}
      {selectedTransaction && (
        <TransactionView
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  )
}
