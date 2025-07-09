'use client';
export const runtime="edge";
import DataTable from '../../../components/DataTable';

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
      <DataTable />
    </div>
  )
}