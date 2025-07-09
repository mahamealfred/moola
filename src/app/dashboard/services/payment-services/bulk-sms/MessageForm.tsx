'use client';

import { useState } from 'react';

const senderIds = ['DDIN', 'Invitation', 'Meeting'];

export default function MessageForm({
  message,
  setMessage,
  senderId,
  setSenderId,
}: {
  message: string;
  setMessage: (msg: string) => void;
  senderId: string;
  setSenderId: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Enter Message Details</h2>

      {/* Sender ID Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Sender ID
        </label>
        <select
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-xl"
        >
          <option value="">Select Sender ID</option>
          {senderIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {/* Message Textarea */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Message
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl"
      ></textarea>

      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        Characters: {message.length} — Cost per SMS:{' '}
        {message.length > 160 ? '30 RWF' : '15 RWF'}
      </p>
    </div>
  );
}
