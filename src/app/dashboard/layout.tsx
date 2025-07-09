'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Wallet,
  CreditCard,
  BarChart2,
  Settings,
  Menu,
  LogOut,
  Bell,
  ChevronDown,
UserCircle ,

} from 'lucide-react';


const navItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Check Balance', href: '/dashboard/balance', icon: Wallet },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { label: 'Commissions', href: '/dashboard/commissions', icon: BarChart2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, type: 'spring', damping: 20 }}
        className="h-screen bg-white dark:bg-gray-800 shadow-lg py-6 px-4 flex flex-col items-start sticky top-0 z-40"
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between w-full mb-8">
          {isExpanded ? (
            <span className="text-2xl font-bold">Moola</span>
          ) : (
            <span className="text-xl font-bold">M</span>
          )}
          <button onClick={toggleSidebar} className="ml-auto">
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
                title={!isExpanded ? item.label : ''}
              >
                <Icon size={20} />
                {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">Network of the best</h1>
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* Avatar Dropdown */}
            <div className="relative">
  <button
    onClick={toggleDropdown}
    className="flex items-center gap-2 focus:outline-none"
  >
    <UserCircle size={32} className="text-gray-700 dark:text-white" />
    
  </button>

  {/* Dropdown Menu */}
  {isDropdownOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 z-50">
      <button
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
        onClick={() => {
          // TODO: Replace with actual logout logic
          alert('Logging out...');
        }}
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  )}
</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
