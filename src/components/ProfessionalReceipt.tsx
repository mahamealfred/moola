'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Building2, User, Phone, Mail, Globe, Calendar, Hash, CreditCard, DollarSign } from 'lucide-react';

interface ReceiptProps {
  // Transaction Information
  transactionId: string;
  date: Date;
  status: 'successful' | 'pending' | 'failed';
  
  // Service Details
  serviceName: string;
  serviceDescription?: string;
  
  // Customer Information
  customerName?: string;
  customerPhone?: string;
  customerReference?: string; // Account number, meter number, etc.
  
  // Agent Information (if applicable)
  agentName?: string;
  agentPhone?: string;
  
  // Financial Details
  amount: number;
  serviceFee?: number;
  totalAmount: number;
  currency?: string;
  
  // Additional Details
  additionalInfo?: { label: string; value: string }[];
  
  // Footer Notes
  customNote?: string;
}

export default function ProfessionalReceipt({
  transactionId,
  date,
  status,
  serviceName,
  serviceDescription,
  customerName,
  customerPhone,
  customerReference,
  agentName,
  agentPhone,
  amount,
  serviceFee = 0,
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
    <div id="receipt" className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg max-w-4xl mx-auto">
      {/* Header with Moola+ Logo */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <div className="flex items-start justify-between mb-4">
          {/* Moola+ Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#ff6600] to-[#ff8533] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-2xl relative">
                  M
                  <span className="absolute text-sm font-bold" style={{ top: '-0.4em', marginLeft: '0.1em' }}>+</span>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight leading-none relative">
                <span className="text-[#ff6600]">M</span><span className="text-[#13294b]">oola</span>
                <span 
                  className="text-[#ff6600] absolute font-bold"
                  style={{
                    fontSize: '0.6em',
                    top: '-0.4em',
                    marginLeft: '0.1em'
                  }}
                >
                  +
                </span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Premium Payment Solutions
              </p>
            </div>
          </div>

        </div>

        {/* Receipt Title */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-[#13294b] dark:text-white mb-1">
            Payment Receipt
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {serviceDescription || 'Official Payment Receipt'}
          </p>
        </div>
      </div>

      {/* DDIN Company Information */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-[#13294b] p-2 rounded-lg flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#13294b] dark:text-white text-base font-semibold mb-1">
              DDIN - Digital Distribution Inclusion Network
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leading provider of digital payment solutions in Rwanda
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm ml-11">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#ff6600]" />
            <span className="text-gray-600 dark:text-gray-300">+250 788 492 972</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#ff6600]" />
            <span className="text-gray-600 dark:text-gray-300">info@ddin.rw</span>
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
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</span>
            </div>
            <p className="text-sm text-[#13294b] dark:text-white pl-6">{transactionId}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Date & Time</span>
            </div>
            <p className="text-sm text-[#13294b] dark:text-white pl-6">
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
              {date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Service</span>
            </div>
            <p className="text-sm text-[#13294b] dark:text-white pl-6">{serviceName}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Customer Information */}
          {customerName && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Customer Name</span>
              </div>
              <p className="text-sm text-[#13294b] dark:text-white pl-6">{customerName}</p>
            </div>
          )}

          {customerPhone && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Customer Phone</span>
              </div>
              <p className="text-sm text-[#13294b] dark:text-white pl-6">{customerPhone}</p>
            </div>
          )}

          {customerReference && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4 text-[#ff6600]" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Reference</span>
              </div>
              <p className="text-sm text-[#13294b] dark:text-white pl-6">{customerReference}</p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Information */}
      {agentName && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-[#ff6600]" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Processed By
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ml-6">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Agent Name</span>
              <span className="text-[#13294b] dark:text-white">{agentName}</span>
            </div>
            {agentPhone && (
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Agent Phone</span>
                <span className="text-[#13294b] dark:text-white">{agentPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Additional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {additionalInfo.map((info, index) => (
              <div key={index}>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{info.label}</span>
                <span className="text-[#13294b] dark:text-white">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="bg-gradient-to-r from-[#ff6600]/5 to-[#ff8533]/5 dark:from-[#ff6600]/10 dark:to-[#ff8533]/10 p-5 rounded-lg border border-[#ff6600]/20 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#ff6600]" />
          <h3 className="text-base font-semibold text-[#13294b] dark:text-white">Payment Summary</h3>
        </div>
        
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Amount</span>
            <span className="text-[#13294b] dark:text-white">{formatCurrency(amount)}</span>
          </div>

          {serviceFee > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-300">Service Fee</span>
              <span className="text-[#13294b] dark:text-white">{formatCurrency(serviceFee)}</span>
            </div>
          )}

          <div className="border-t border-[#ff6600]/20 pt-2.5 mt-2.5">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-[#ff6600]">Total Paid</span>
              <span className="text-xl font-bold text-[#ff6600]">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {customNote || 'Thank you for using Moola+ payment services. This is an official receipt for your transaction.'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
          For support or inquiries, contact us at +250 788 492 972 or info@ddin.rw
        </p>
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-600">
          <span>Powered by</span>
          <span className="font-semibold text-[#ff6600]">Moola<sup>+</sup></span>
          <span>•</span>
          <span>DDIN © {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
