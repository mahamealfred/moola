'use client';

import React, { useState } from 'react';

export default function ExpenseManagement() {
  const [expenses,] = useState([
    { category: 'Office Supplies', amount: 150000, date: '2024-01-10', status: 'Approved' },
    { category: 'Utilities', amount: 80000, date: '2024-01-12', status: 'Pending' },
    { category: 'Travel', amount: 120000, date: '2024-01-15', status: 'Approved' },
  ]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Expense Management</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border">
            <div className="text-sm text-blue-600 dark:text-blue-300">Total Expenses</div>
            <div className="text-xl font-bold">RWF {totalExpenses.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border">
            <div className="text-sm text-green-600 dark:text-green-300">Approved</div>
            <div className="text-xl font-bold">RWF 270,000</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border">
            <div className="text-sm text-orange-600 dark:text-orange-300">Pending</div>
            <div className="text-xl font-bold">RWF 80,000</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <h4 className="font-medium p-4 border-b">Recent Expenses</h4>
          <div className="divide-y">
            {expenses.map((expense, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{expense.category}</div>
                  <div className="text-sm text-gray-600">{expense.date}</div>
                </div>
                <div className="text-right">
                  <div>RWF {expense.amount.toLocaleString()}</div>
                  <div className={`text-xs ${
                    expense.status === 'Approved' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {expense.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-[#ff6600] text-white py-2 rounded hover:bg-[#e55a00] transition-colors">
          + Add New Expense
        </button>
      </div>
    </div>
  );
}