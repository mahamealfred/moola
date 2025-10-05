'use client';

import React, { useState, useEffect } from 'react';
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
import { FiPrinter, FiSearch, FiDownload, FiChevronLeft, FiChevronRight, FiRefreshCw, FiEye, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import { secureStorage } from '../../../lib/auth-context';

interface Transaction {
  id: string;
  date: string;
  formattedDate: string;
  processDate: string;
  formattedProcessDate: string;
  amount: number;
  formattedAmount: string;
  customerCharge: number;
  token: string | null;
  status: 'successful' | 'pending' | 'failed';
  description: string;
  serviceName: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}

// Fixed custom filter function with proper return type
const globalFilterFn: FilterFn<Transaction> = (row, columnId, filterValue) => {
  const search = filterValue.toLowerCase();
  
  const searchableFields = [
    row.original.id.toLowerCase(),
    row.original.date.toLowerCase(),
    row.original.formattedDate.toLowerCase(),
    row.original.status.toLowerCase(),
    row.original.description.toLowerCase(),
    row.original.serviceName.toLowerCase(),
    row.original.amount.toString(),
    row.original.token ? row.original.token.toLowerCase() : ''
  ];

  return searchableFields.some(field => field.includes(search));
};

// Mobile Transaction Card Component
const MobileTransactionCard: React.FC<{
  transaction: Transaction;
  onView: (tx: Transaction) => void;
  onPrint: (tx: Transaction) => void;
}> = ({ transaction, onView, onPrint }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-3 shadow-sm"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
              ID: {transaction.id}
            </span>
            <StatusBadge status={transaction.status} />
          </div>
          <h3 className="font-medium text-gray-800 dark:text-white text-sm capitalize">
            {transaction.serviceName}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {transaction.formattedDate}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <FiChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-gray-500 dark:text-gray-400 text-xs">Amount:</span>
          <p className="font-medium text-gray-800 dark:text-white">
            RWF {transaction.amount.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
        {transaction.token && (
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-xs">Token:</span>
            <p className="font-mono text-xs text-gray-800 dark:text-white truncate">
              {transaction.token}
            </p>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3"
        >
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-xs">Description:</span>
              <p className="text-gray-800 dark:text-white text-xs leading-relaxed">
                {transaction.description}
              </p>
            </div>
            {transaction.processDate && (
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Processed:</span>
                <p className="text-gray-800 dark:text-white text-xs">
                  {transaction.formattedProcessDate}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onView(transaction)}
              className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
            >
              <FiEye className="w-3 h-3" />
              View
            </button>
            <button
              onClick={() => onPrint(transaction)}
              className="flex-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 py-2 px-3 rounded-lg text-xs font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center justify-center gap-1"
            >
              <FiPrinter className="w-3 h-3" />
              Print
            </button>
          </div>
        </motion.div>
      )}

      {/* Collapsed Actions */}
      {!isExpanded && (
        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onView(transaction)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs flex items-center gap-1"
          >
            <FiEye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={() => onPrint(transaction)}
            className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-xs flex items-center gap-1"
          >
            <FiPrinter className="w-3 h-3" />
            Print
          </button>
        </div>
      )}
    </motion.div>
  );
};

const printPDF = (tx: Transaction) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Transaction Receipt - ${tx.id}`, 20, 20);
  autoTable(doc, {
    startY: 30,
    head: [['Field', 'Value']],
    body: [
      ['Transaction ID', tx.id],
      ['Date', tx.formattedDate],
      ['Service', tx.serviceName],
      ['Status', tx.status],
      ['Amount', `RWF ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Token', tx.token || 'N/A'],
      ['Description', tx.description],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [255, 102, 0],
      textColor: 255
    },
  });
  doc.save(`Receipt_${tx.id}.pdf`);
};

// Transaction Detail Modal Component
const TransactionDetailModal: React.FC<{
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              Transaction Details
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              ID: {transaction.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transaction ID
                  </label>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-white font-mono">
                    {transaction.id}
                  </p>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date & Time
                  </label>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-white">
                    {transaction.formattedDate}
                  </p>
                  {transaction.processDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Processed: {transaction.formattedProcessDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Service
                  </label>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-white capitalize">
                    {transaction.serviceName}
                  </p>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={transaction.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                Financial Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Amount
                  </label>
                  <p className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white">
                    RWF {transaction.amount.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </div>

                {transaction.customerCharge > 0 && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customer Charge
                    </label>
                    <p className="text-xs sm:text-sm text-gray-800 dark:text-white">
                      RWF {transaction.customerCharge.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                )}

                {transaction.token && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Token
                    </label>
                    <p className="text-xs sm:text-sm text-gray-800 dark:text-white font-mono break-all">
                      {transaction.token}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {transaction.description}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors order-2 sm:order-1"
          >
            Close
          </button>
          <button
            onClick={() => {
              printPDF(transaction);
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#ff6600] rounded-lg hover:bg-[#e65c00] transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <FiPrinter className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const fetchTransactions = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const accessToken = secureStorage.getAccessToken();
      
      if (!accessToken) {
        throw new Error('Authentication required. Please login again.');
      }

      // Try different endpoint variations
      const endpoints = [
  'https://core-api.ddin.rw/v1/agency/thirdpartyagency/services/transactions/history',
  'https://core-api.ddin.rw/v1/agency/thirdpartyagency/transactions/history',
  'https://core-api.ddin.rw/v1/agency/transactions/history',
  'https://core-api.ddin.rw/v1/transactions/history'
      ];

      let response = null;
      let lastError = null;

      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const apiResponse: ApiResponse = await response.json();
            
            if (apiResponse.success) {
              setData(apiResponse.data || []);
              return; // Success, exit the function
            } else {
              lastError = new Error(apiResponse.message || 'Failed to fetch transactions');
            }
          } else if (response.status !== 404) {
            // If it's not 404, throw the error
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // If 404, continue to next endpoint
        } catch (err) {
          lastError = err;
          // Continue to next endpoint
        }
      }

      // If we get here, all endpoints failed
      throw lastError || new Error('All endpoints failed. Please check the API URL.');

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
      
      // For development - show sample data when API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using sample data for development');
        setData([
          {
            "id": "179885",
            "date": "2025-09-30T15:32:12.000Z",
            "formattedDate": "30/09/2025",
            "processDate": "2025-09-30T15:32:12.000Z",
            "formattedProcessDate": "30/09/2025",
            "amount": 100,
            "formattedAmount": "100.00 Rwf",
            "customerCharge": 0,
            "token": "59685371670521636119",
            "status": "successful",
            "description": "Payment processed successfully for electricity token. Customer received token immediately.",
            "serviceName": "electricity"
          },
          {
            "id": "179912",
            "date": "2025-09-30T15:50:07.000Z",
            "formattedDate": "30/09/2025",
            "processDate": "2025-09-30T15:50:07.000Z",
            "formattedProcessDate": "30/09/2025",
            "amount": 100,
            "formattedAmount": "100.00 Rwf",
            "customerCharge": 0,
            "token": null,
            "status": "successful",
            "description": "Airtime top-up completed successfully. Amount credited to customer's phone number.",
            "serviceName": "airtime"
          }
        ]);
        setError(''); // Clear error since we're using sample data
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    fetchTransactions(true);
  };

  // Create columns here so they can access component-scoped handlers
  const helper = createColumnHelper<Transaction>();

  const columns = [
    helper.accessor('id', { 
      header: 'Tx ID',
      cell: (info) => (
        <span className="font-mono text-xs sm:text-sm">{info.getValue()}</span>
      ),
      size: 100,
    }),
    helper.accessor('formattedDate', { 
      header: 'Date',
      cell: (info) => (
        <span className="whitespace-nowrap text-xs sm:text-sm">{info.getValue()}</span>
      ),
      size: 110,
    }),
    helper.accessor('serviceName', { 
      header: 'Service',
      cell: (info) => (
        <span className="truncate block text-xs sm:text-sm capitalize">{info.getValue()}</span>
      ),
      size: 120,
    }),
    helper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
      size: 100,
    }),
    helper.accessor('amount', {
      header: 'Amount (RWF)',
      cell: (info) => (
        <span className="font-medium whitespace-nowrap text-xs sm:text-sm">
          {info.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
      size: 120,
    }),
    helper.accessor('token', {
      header: 'Token',
      cell: (info) => (
        <span className="font-mono text-xs sm:text-sm truncate block">
          {info.getValue() || 'N/A'}
        </span>
      ),
      size: 120,
    }),
    helper.accessor('description', { 
      header: 'Description',
      cell: (info) => (
        <span className="truncate block text-xs sm:text-sm">{info.getValue()}</span>
      ),
      size: 150,
    }),
    helper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewTransaction(row.original)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-xs sm:text-sm"
            title="View Details"
          >
            <FiEye className="text-xs sm:text-sm" /> 
            <span className="hidden xs:inline">View</span>
          </button>
          <button
            onClick={() => printPDF(row.original)}
            className="text-[#ff6600] hover:text-[#e65c00] flex items-center gap-1 text-xs sm:text-sm"
            title="Print Receipt"
          >
            <FiPrinter className="text-xs sm:text-sm" /> 
            <span className="hidden xs:inline">Print</span>
          </button>
        </div>
      ),
      size: 120,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { 
      globalFilter: filter,
      pagination: {
        pageSize: 8,
        pageIndex: 0,
      }
    },
    onGlobalFilterChange: setFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-950 transition-colors w-full max-w-full overflow-x-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-[#ff6600] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-950 transition-colors w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">View and manage your payment transactions</p>
              {error && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                    {error} - Showing sample data for demonstration
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#13294b] dark:bg-[#ff6600] text-white rounded-xl hover:bg-[#0f213d] dark:hover:bg-[#e65c00] transition-colors disabled:opacity-50 text-sm"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
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

        {/* Mobile View */}
        {isMobile ? (
          <div className="space-y-3">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <MobileTransactionCard
                  key={row.id}
                  transaction={row.original}
                  onView={handleViewTransaction}
                  onPrint={printPDF}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {data.length === 0 ? 'No transactions found.' : 'No transactions match your search.'}
              </div>
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto bg-white/70 dark:bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 w-full"
          >
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
                      {data.length === 0 ? 'No transactions found.' : 'No transactions match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

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
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}