'use client';

export default function Confirmation({ recipients, message, cost, total,senderId }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Confirm Bulk SMS</h2>
      <p>Recipients: {recipients.length}</p>
      <p>Sender ID: {senderId || 'N/A'}</p>
      <p>Message: {message}</p>
      <p>Cost per SMS: {cost} RWF</p>
      <p className="font-bold">Total Cost: {total} RWF</p>
    </div>
  );
}
