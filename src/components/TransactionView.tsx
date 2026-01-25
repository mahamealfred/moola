'use client';

import React from 'react';
import { FiEye, FiPrinter } from 'react-icons/fi';
import StatusBadge from '@/app/dashboard/transactions/StatusBadge';

export interface TransactionViewProps {
	id: string;
	date?: string;
	formattedDate?: string;
	amount?: number;
	formattedAmount?: string;
	customerCharge?: number;
	token?: string | null;
	status?: string;
	description?: string;
	serviceName?: string;
	onView?: () => void;
	onPrint?: () => void;
}

export default function TransactionView({
	id,
	formattedDate,
	amount,
	formattedAmount,
	token,
	status = 'pending',
	description,
	serviceName,
	onView,
	onPrint,
}: TransactionViewProps) {
	return (
		<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
			<div className="flex items-start justify-between mb-2">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-mono text-xs text-gray-500">ID: {id}</span>
						<StatusBadge status={String(status)} />
					</div>
					<h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">{serviceName}</h4>
					{formattedDate && <p className="text-xs text-gray-500">{formattedDate}</p>}
				</div>

				<div className="flex items-center gap-2">
					<button onClick={onView} title="View" className="text-[#13294b] hover:text-[#ff6600]">
						<FiEye />
					</button>
					<button onClick={onPrint} title="Print" className="text-orange-600 hover:text-orange-800">
						<FiPrinter />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 text-sm">
				<div>
					<span className="text-xs text-gray-500">Amount</span>
					<p className="font-medium text-gray-800 dark:text-white">{formattedAmount ?? (amount != null ? `RWF ${amount.toLocaleString()}` : 'N/A')}</p>
				</div>
				{token && (
					<div>
						<span className="text-xs text-gray-500">Token</span>
						<p className="font-mono text-xs text-gray-800 dark:text-white truncate">{token}</p>
					</div>
				)}
			</div>

			{description && (
				<p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">{description}</p>
			)}
		</div>
	);
}
