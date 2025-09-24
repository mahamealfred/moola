'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Wallet,
  CreditCard,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  UserCircle,
  Loader2,
  Shield,
} from 'lucide-react';
import { useAuth } from '..//../lib/auth-context';

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
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      title={!isExpanded ? label : ''}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
        isActive
          ? 'bg-[#ff6600] text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-[#ff660020] dark:hover:bg-[#ff660020] hover:scale-105'
      }`}
    >
      <Icon size={20} className="flex-shrink-0" />
      {isExpanded && <span className="whitespace-nowrap text-sm font-medium">{label}</span>}
      {!isExpanded && (
        <span className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {label}
        </span>
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectPath = '/login?redirect=' + encodeURIComponent(pathname);
      router.push(redirectPath);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-12 h-12 border-4 border-[#ff6600] border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Security Indicator */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs border border-green-200 dark:border-green-800">
        <Shield className="w-3 h-3" />
        Secure Session
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, type: 'spring', damping: 25 }}
        className="hidden md:flex h-screen bg-white dark:bg-gray-900 shadow-lg py-6 px-4 flex-col sticky top-0 z-40"
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between w-full mb-8">
          {isExpanded ? (
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-[#ff6600]">X</span>
              <span className="text-[#13294b] dark:text-white">-Pay</span>
            </h1>
          ) : (
            <h1 className="text-xl font-extrabold tracking-tight text-[#ff6600]">X</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* User Info (Expanded Only) */}
        {isExpanded && user && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.category}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.phoneNumber}
            </p>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex flex-col gap-2 w-full flex-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              isExpanded={isExpanded}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all mt-auto"
          aria-label="Logout"
        >
          <LogOut size={20} />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-2xl py-6 px-4 flex flex-col z-50 md:hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between w-full mb-8">
                <h1 className="text-xl font-extrabold tracking-tight">
                  <span className="text-[#ff6600]">X</span>
                  <span className="text-[#13294b] dark:text-white">-Pay</span>
                </h1>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.category} • {user.phoneNumber}
                  </p>
                </div>
              )}

              {/* Mobile Nav Items */}
              <nav className="flex flex-col gap-2 w-full flex-1">
                {navItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    {...item}
                    isActive={pathname === item.href}
                    isExpanded={true}
                    onClick={closeMobileMenu}
                  />
                ))}
              </nav>

              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all mt-auto"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
        {/* Header */}
        <header className="px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 shadow-sm flex justify-between items-center z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold truncate">
              {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notifications */}
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="User menu"
              >
                <UserCircle size={32} className="text-gray-700 dark:text-white" />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name.split(' ')[0]}
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.category} • {user?.phoneNumber}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
          {/* Animated Background Blobs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
              className="absolute w-48 h-48 bg-[#ff660020] rounded-full blur-2xl top-10 left-1/4"
              animate={{ y: [0, 10, -10, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-40 h-40 bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-xl bottom-5 right-1/4"
              animate={{ x: [0, -8, 8, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}