'use client';

import { useState } from 'react';
import Papa from 'papaparse';

export default function CSVUpload({ onUpload }: { onUpload: Function }) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        const filtered = results.data.filter((row: any) => row.name && row.phone);
        onUpload(filtered);
        setFileName(file.name);
      },
    });
  };

  const sampleCSV = `name,phone
John Doe,250781234567
Jane Smith,250788765432`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bulk-sms-sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Upload Recipients CSV</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-gray-100 dark:bg-gray-700"
      />
      {fileName && (
        <p className="text-sm text-gray-500 mt-2">✅ File loaded: {fileName}</p>
      )}

      <button
        onClick={downloadSampleCSV}
        className="mt-3 text-blue-600 hover:underline text-sm"
      >
        📥 Download sample file format
      </button>
    </div>
  );
}
