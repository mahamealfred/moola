'use client';
export const runtime="edge";
export default function BalancePage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Float Balance</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
        <p className="text-3xl font-semibold text-green-600 dark:text-green-400">RWF 120,000</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">As of June 9, 2025</p>
      </div>
    </div>
  );
}
