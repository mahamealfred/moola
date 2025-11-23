'use client';

import { useState } from 'react';

interface Recipient {
  phone: string;
  amount: number;
}

interface RecipientListProps {
  recipients: Recipient[];
  setRecipients: (recipients: Recipient[]) => void;
}

export default function RecipientList({ recipients, setRecipients }: RecipientListProps) {
  const [newRecipient, setNewRecipient] = useState({ phone: '', amount: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const removeRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients);
  };

  const addRecipient = () => {
    if (!newRecipient.phone.trim()) {
      alert('Phone number is required');
      return;
    }

    const amount = parseInt(newRecipient.amount);
    if (!amount || amount < 100) {
      alert('Please enter a valid amount (minimum 100 RWF)');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(newRecipient.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    setRecipients([...recipients, { phone: newRecipient.phone, amount }]);
    setNewRecipient({ phone: '', amount: '' });
    setShowAddForm(false);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to remove all recipients?')) {
      setRecipients([]);
    }
  };

  const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          Recipients ({recipients.length})
        </h2>
        {recipients.length > 0 && (
          <button
            onClick={clearAll}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {/* Add Recipient Form */}
      {showAddForm && (
        <div className="bg-[#ff6600]/5 dark:bg-[#ff6600]/10 p-3 rounded-lg mb-3 border border-[#ff6600]/20 dark:border-[#ff6600]/30">
          <h3 className="font-semibold text-[#13294b] dark:text-[#ff6600] text-sm mb-2">Add New Recipient</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Phone Number *</label>
              <input
                type="text"
                value={newRecipient.phone}
                onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                placeholder="+250788123456"
                className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Amount (RWF) *</label>
              <input
                type="number"
                value={newRecipient.amount}
                onChange={(e) => setNewRecipient({ ...newRecipient, amount: e.target.value })}
                placeholder="1000"
                min={100}
                className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addRecipient}
              className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-3 py-1 rounded text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Recipient
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Recipient Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Recipient Manually
        </button>
      )}

      {/* Recipients List */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
        {recipients.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">No recipients added yet</p>
            <p className="text-xs mt-1">Upload a CSV file or add recipients manually</p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {recipients.map((recipient, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {recipient.phone}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amount: RWF {recipient.amount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeRecipient(index)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2 transition-colors"
                  title="Remove recipient"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {recipients.length > 0 && (
        <div className="mt-3 p-3 bg-[#ff660010] dark:bg-[#ff660020] rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-700 dark:text-gray-300">Total Recipients:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-[#ff6600]">{recipients.length}</span>
            </div>
            <div>
              <span className="text-gray-700 dark:text-gray-300">Total Amount:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-[#ff6600]">RWF {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}