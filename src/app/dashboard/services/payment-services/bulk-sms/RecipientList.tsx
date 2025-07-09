'use client';

import { useState } from 'react';

export default function RecipientList({ recipients, setRecipients }: any) {
  const [manual, setManual] = useState({ name: '', phone: '' });

  const addManual = () => {
    if (manual.name && manual.phone) {
      setRecipients([...recipients, manual]);
      setManual({ name: '', phone: '' });
    }
  };

  const remove = (index: number) => {
    setRecipients(recipients.filter((_: any, i: number) => i !== index));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Recipients ({recipients.length})</h2>

      <div className="mb-4">
        <input
          placeholder="Name"
          value={manual.name}
          onChange={e => setManual({ ...manual, name: e.target.value })}
          className="mr-2 px-3 py-2 rounded border dark:bg-gray-700"
        />
        <input
          placeholder="Phone"
          value={manual.phone}
          onChange={e => setManual({ ...manual, phone: e.target.value })}
          className="mr-2 px-3 py-2 rounded border dark:bg-gray-700"
        />
        <button
          onClick={addManual}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {recipients.map((r: any, idx: number) => (
          <li key={idx} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
            <span>{r.name} - {r.phone}</span>
            <button
              onClick={() => remove(idx)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
