'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  UserCircle,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Check Balance', href: '/dashboard/balance', icon: Wallet },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { label: 'Commissions', href: '/dashboard/commission', icon: BarChart2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function SidebarItem({
  href,
  label,
  icon: Icon,
  isActive,
  isExpanded,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isExpanded: boolean;
}) {
  return (
    <Link
      href={href}
      title={!isExpanded ? label : ''}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors group relative ${
        isActive
          ? 'bg-[#ff6600] text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-[#ff660020] dark:hover:bg-[#ff660020]'
      }`}
    >
      <Icon size={20} />
      {isExpanded && <span className="whitespace-nowrap">{label}</span>}
      {!isExpanded && (
        <span className="absolute left-full ml-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 z-50">
          {label}
        </span>
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-500">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, type: 'spring', damping: 20 }}
        className="h-screen bg-white dark:bg-gray-900 shadow-md py-6 px-4 flex flex-col sticky top-0 z-40"
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between w-full mb-10">
          <span className="text-xl font-bold">{isExpanded ? 
         <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-[#ff6600]">X</span>
            <span className="text-[#13294b] dark:text-white">-Pay</span>
          </h1> :
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-[#ff6600]">X</span>
          </h1>  
        }</span>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="ml-auto text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-4 w-full">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              isExpanded={isExpanded}
            />
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="px-6 py-4 bg-white dark:bg-gray-900 shadow-sm flex justify-between items-center z-30">
          <h1 className="text-xl font-semibold">Agent Portal</h1>
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <UserCircle size={32} className="text-gray-700 dark:text-white" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
              className="absolute w-72 h-72 bg-[#ff660020] rounded-full blur-3xl top-20 left-1/4"
              animate={{ y: [0, 20, -20, 0], x: [0, 10, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-60 h-60 bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-2xl bottom-10 right-1/4"
              animate={{ x: [0, -15, 15, 0], y: [0, 10, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-96 h-96 bg-purple-300/20 dark:bg-purple-800/20 rounded-full blur-2xl top-1/3 right-10"
              animate={{ scale: [1, 1.05, 0.95, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

        
            {children}
         
        </main>
      </div>
    </div>
  );
}
