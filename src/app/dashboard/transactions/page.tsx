'use client';

import { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const mockData = [
  { id: 'TX123', user: 'John Doe', amount: 25000, status: 'Success', date: '2025-06-09' },
  { id: 'TX124', user: 'Jane Smith', amount: 12000, status: 'Pending', date: '2025-06-08' },
  { id: 'TX125', user: 'Michael Lee', amount: 5000, status: 'Failed', date: '2025-06-07' },
];

export default function Transactions() {
  const [search, setSearch] = useState('');

  const columns = useMemo(() => [
    { Header: 'Transaction ID', accessor: 'id' },
    { Header: 'User', accessor: 'user' },
    { Header: 'Amount (RWF)', accessor: 'amount' },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }:any) => {
        const statusColor = {
          Success: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Failed: 'bg-red-100 text-red-800',
        }[value] || 'bg-gray-100 text-gray-800';

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {value}
          </span>
        );
      },
    },
    { Header: 'Date', accessor: 'date' },
  ], []);

  const data = useMemo(() => {
    return mockData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    { columns, data, initialState: { pageSize: 5 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transactions Report', 14, 10);
    autoTable(doc, {
      head: [columns.map((col) => col.Header)],
      body: data.map((row) => columns.map((col) => row[col.accessor])),
    });
    doc.save('transactions.pdf');
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search transactions..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <CSVLink
            filename="transactions.csv"
            data={data}
            headers={columns.map((col) => ({ label: col.Header, key: col.accessor }))}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </CSVLink>
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full text-sm text-left border dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`header-${i}`}>
                {headerGroup.headers.map((column, j) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`column-${j}`}
                    className="px-4 py-2 cursor-pointer"
                  >
                    {column.render('Header')}
                    {column.isSorted && (column.isSortedDesc ? ' 🔽' : ' 🔼')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-200 dark:divide-gray-700">
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${row.original.id}`} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  {row.cells.map((cell, j) => (
                    <td {...cell.getCellProps()} key={`cell-${row.original.id}-${j}`} className="px-4 py-2">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <div className="space-x-2">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
