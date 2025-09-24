'use client';

import React, { useState } from 'react';

export default function BulkSalaryPayment() {
  const [file, setFile] = useState<File | null>(null);
  const [employees,] = useState([
    { name: 'John Doe', account: '1234567890', amount: 500000 },
    { name: 'Jane Smith', account: '0987654321', amount: 450000 },
    { name: 'Mike Johnson', account: '1122334455', amount: 600000 },
  ]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Bulk Salary Payment</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Upload Salary Sheet (CSV/Excel)</label>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <h4 className="font-medium mb-3">Payment Preview</h4>
          <div className="space-y-2">
            {employees.map((emp, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{emp.name}</span>
                <span>RWF {emp.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-[#ff6600] text-white py-2 rounded hover:bg-[#e55a00] transition-colors">
          Process Payments (Total: RWF 1,550,000)
        </button>
      </div>
    </div>
  );
}