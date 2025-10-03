'use client';

interface Recipient {
  phone: string;
  amount: number;
}

interface ConfirmationProps {
  recipients: Recipient[];
  total: number;
}

export default function Confirmation({ recipients, total }: ConfirmationProps) {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">Confirm Airtime Transfer</h2>
      <div className="bg-[#ff660010] dark:bg-[#ff660020] p-3 md:p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">Transaction Summary</h3>
        
        <div className="grid grid-cols-2 gap-3 text-sm md:text-base mb-3">
          <div>
            <p>
              <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Recipients</strong>
              {recipients.length}
            </p>
          </div>
          <div>
            <p>
              <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Amount</strong>
              RWF {total.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="font-semibold mt-3 md:mt-4 border-t pt-2 md:pt-3 text-[#ff6600] text-base md:text-lg">
          <strong className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">Total to Pay</strong>
          RWF {total.toLocaleString()}
        </p>
      </div>

      <div className="mt-3 md:mt-4">
        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm">Recipients ({recipients.length})</h4>
        <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded p-2">
          {recipients.map((recipient, index) => (
            <div key={index} className="flex justify-between text-xs text-gray-600 dark:text-gray-400 py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
              <span>{recipient.phone}</span>
              <span className="font-medium">RWF {recipient.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}