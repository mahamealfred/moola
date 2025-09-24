'use client';

import React, { useState } from 'react';

export default function TaxCalculation() {
  const [revenue, setRevenue] = useState('');
  const [expenses, setExpenses] = useState('');
  const [taxResult, setTaxResult] = useState<number | null>(null);

  const calculateTax = () => {
    const profit = Number(revenue) - Number(expenses);
    const tax = profit * 0.3; // 30% corporate tax rate example
    setTaxResult(tax > 0 ? tax : 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Tax Calculation</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Annual Revenue (RWF)</label>
            <input 
              type="number" 
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter revenue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Annual Expenses (RWF)</label>
            <input 
              type="number" 
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter expenses"
            />
          </div>
        </div>

        <button 
          onClick={calculateTax}
          className="w-full bg-[#13294b] text-white py-2 rounded hover:bg-[#1a3a6b] transition-colors"
        >
          Calculate Tax
        </button>

        {taxResult !== null && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-300">Tax Calculation Result</h4>
            <p className="text-green-700 dark:text-green-200 mt-2">
              Estimated Corporate Tax: <strong>RWF {taxResult.toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}