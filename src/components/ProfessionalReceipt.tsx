'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Building2, User, Phone, Mail, Globe, Calendar, Hash, CreditCard, DollarSign } from 'lucide-react';

interface ReceiptProps {
  // Transaction Information
  transactionId: string;
  receiptId: string;
  date: Date;
  status: 'successful' | 'pending' | 'failed';
  
  // Service Details
  serviceName: string;
  serviceDescription?: string;
  
  // Customer Information
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerReference?: string; // Account number, meter number, etc.
  
  // Agent Information (if applicable)
  agentName?: string;
  agentId?: string;
  agentPhone?: string;
  
  // Financial Details
  amount: number;
  serviceFee?: number;
  vat?: number;
  tax?: number;
  totalAmount: number;
  currency?: string;
  
  // Additional Details
  additionalInfo?: { label: string; value: string }[];
  
  // Footer Notes
  customNote?: string;
}

export default function ProfessionalReceipt({
  transactionId,
  receiptId,
  date,
  status,
  serviceName,
  serviceDescription,
  customerName,
  customerPhone,
  customerEmail,
  customerReference,
  agentName,
  agentId,
  agentPhone,
  amount,
  serviceFee = 0,
  vat = 0,
  tax = 0,
  totalAmount,
  currency = 'RWF',
  additionalInfo,
  customNote
}: ReceiptProps) {
  
  const formatCurrency = (value: number) => {
    return `${currency} ${value.toLocaleString()}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'successful':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div id="receipt" className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl max-w-4xl mx-auto">
      {/* Header with Moola+ Logo */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          {/* Moola+ Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-white font-black text-xl tracking-tighter drop-shadow relative">
                  M
                  <span className="absolute text-sm font-black" style={{ top: '-0.3em', marginLeft: '0.1em' }}>+</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-xl blur-sm opacity-50 -z-10" />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight leading-none relative">
                <span className="bg-gradient-to-r from-[#ff6600] via-[#ff7700] to-[#ff8533] bg-clip-text text-transparent">
                  M
                </span>
                <span className="text-[#13294b] dark:text-white">oola</span>
                <span 
                  className="text-[#13294b] dark:text-white absolute"
                  style={{
                    fontSize: '0.6em',
                    top: '-0.3em',
                    marginLeft: '0.1em'
                  }}
                >
                  +
                </span>
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium tracking-wider mt-0.5">
                Premium Payment Solutions
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              status === 'successful' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : status === 'pending'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <CheckCircle2 className={`w-5 h-5 ${getStatusColor()}`} />
              <span className={`font-bold text-sm uppercase ${getStatusColor()}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Title */}
        <div className="text-center mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#13294b] dark:text-white mb-2">
            Payment Receipt
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {serviceDescription || 'Official Payment Receipt'}
          </p>
        </div>
      </div>

      {/* DDIN Company Information */}
      <div className="bg-gradient-to-br from-[#13294b]/5 to-[#ff6600]/5 dark:from-[#13294b]/10 dark:to-[#ff6600]/10 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-[#13294b] p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#13294b] dark:text-white text-lg mb-1">
              DDIN - Digital Development & Innovation Network
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Leading provider of digital payment solutions in Rwanda
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#ff6600]" />
            <span className="text-gray-700 dark:text-gray-300">+250 788 492 972</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#ff6600]" />
            <span className="text-gray-700 dark:text-gray-300">info@ddin.rw</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ff6600]" />
            <a href="https://ddin.rw" target="_blank" rel="noopener noreferrer" className="text-[#ff6600] hover:underline">
              ddin.rw
            </a>
          </div>
        </div>
      </div>

      {/* Transaction Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Receipt ID</span>
            </div>
            <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{receiptId}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Transaction ID</span>
            </div>
            <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{transactionId}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date & Time</span>
            </div>
            <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
              {date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Service</span>
            </div>
            <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{serviceName}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Customer Information */}
          {customerName && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer Name</span>
              </div>
              <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{customerName}</p>
            </div>
          )}

          {customerPhone && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer Phone</span>
              </div>
              <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{customerPhone}</p>
            </div>
          )}

          {customerEmail && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer Email</span>
              </div>
              <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{customerEmail}</p>
            </div>
          )}

          {customerReference && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Reference</span>
              </div>
              <p className="text-base font-bold text-[#13294b] dark:text-white pl-6">{customerReference}</p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Information (if applicable) */}
      {agentName && (
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Agent Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Agent Name</span>
              <span className="font-bold text-[#13294b] dark:text-white">{agentName}</span>
            </div>
            {agentId && (
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Agent ID</span>
                <span className="font-bold text-[#13294b] dark:text-white">{agentId}</span>
              </div>
            )}
            {agentPhone && (
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Agent Phone</span>
                <span className="font-bold text-[#13294b] dark:text-white">{agentPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Additional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {additionalInfo.map((info, index) => (
              <div key={index}>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{info.label}</span>
                <span className="font-bold text-[#13294b] dark:text-white">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="bg-gradient-to-br from-[#ff6600]/10 to-[#ff8533]/5 dark:from-[#ff6600]/20 dark:to-[#ff8533]/10 p-6 rounded-xl border-2 border-[#ff6600]/30 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#ff6600]" />
          <h3 className="text-lg font-bold text-[#13294b] dark:text-white">Payment Details</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-base">
            <span className="text-gray-700 dark:text-gray-300">Amount</span>
            <span className="font-bold text-[#13294b] dark:text-white">{formatCurrency(amount)}</span>
          </div>

          {serviceFee > 0 && (
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-700 dark:text-gray-300">Service Fee</span>
              <span className="font-bold text-[#13294b] dark:text-white">{formatCurrency(serviceFee)}</span>
            </div>
          )}

          {vat > 0 && (
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-700 dark:text-gray-300">VAT (18%)</span>
              <span className="font-bold text-[#13294b] dark:text-white">{formatCurrency(vat)}</span>
            </div>
          )}

          {tax > 0 && (
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-700 dark:text-gray-300">Tax</span>
              <span className="font-bold text-[#13294b] dark:text-white">{formatCurrency(tax)}</span>
            </div>
          )}

          <div className="border-t-2 border-[#ff6600]/30 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-[#ff6600]">Total Paid</span>
              <span className="text-2xl font-black text-[#ff6600]">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {customNote || 'Thank you for using Moola+ payment services. This is an official receipt for your transaction.'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
          For support or inquiries, contact us at +250 788 492 972 or info@ddin.rw
        </p>
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-600">
          <span>Powered by</span>
          <span className="font-bold text-[#ff6600]">Moola+</span>
          <span>•</span>
          <span>DDIN © {new Date().getFullYear()}</span>
        </div>

        {/* QR Code Placeholder */}
        <div className="mt-4 flex justify-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">QR Code</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
          Scan for verification
        </p>
      </div>
    </div>
  );
}
