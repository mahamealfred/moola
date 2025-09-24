'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiLock, 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiShield, 
  FiHelpCircle, 
  FiCreditCard,
  FiGlobe,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

export default function SettingsComponent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'appearance', label: 'Appearance', icon: <FiMoon /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'privacy', label: 'Privacy', icon: <FiShield /> },
    { id: 'payment', label: 'Payment Methods', icon: <FiCreditCard /> },
    { id: 'language', label: 'Language', icon: <FiGlobe /> },
    { id: 'help', label: 'Help & Support', icon: <FiHelpCircle /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  defaultValue="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  defaultValue="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  defaultValue="john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark极速赛车开奖直播 :bg-gray-700 dark:text-white"
                  defaultValue="+250 78X XXX XXX"
                />
              </div>
            </div>
            <button className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg transition">
              Save Changes
            </button>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
            <button className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg transition">
              Update Password
            </button>

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">2FA is disabled</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-4 py-2 rounded-lg text-sm transition">
                  Enable
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? <FiMoon className="text-[#ff6600]" /> : <FiSun className="text-[#ff6600]" />}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {darkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#ff6600]"></div>
              </label>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Font Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Small', 'Medium', 'Large'].map((size) => (
                  <button
                    key={size}
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
            
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">{key} Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {value ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationToggle(key as keyof typeof notifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#ff6600]"></div>
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Settings</h2>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Data Privacy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Control how your data is used and shared
              </p>
              <button className="text-[#ff6600] hover:underline text-sm">
                Manage data settings
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Account Visibility</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Control who can see your account information
              </p>
              <button className="text-[#ff6600] hover:underline text-sm">
                Adjust visibility settings
              </button>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Credit Card</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">**** **** **** 1234</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expires: 12/2025</p>
              <button className="text-[#ff6600] hover:underline text-sm mt-3">
                Edit card
              </button>
            </div>

            <button className="flex items-center text-[#ff6600] hover:text-[#e65c00] transition">
              <FiCreditCard className="mr-2" />
              Add new payment method
            </button>
          </div>
        );
      
      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Language Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                App Language
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option>English</option>
              
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option>RWF - Rwandan Franc</option>
                
              </select>
            </div>
          </div>
        );
      
      case 'help':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Help & Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">FAQs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Find answers to common questions
                </p>
                <button className="text-[#ff6600] hover:underline text-sm">
                  View FAQs
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get help from our support team
                </p>
                <button className="text-[#ff6600] hover:underline text-sm">
                  Contact us
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Terms of Service</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Review our terms and conditions
                </p>
                <button className="text-[#ff6600] hover:underline text-sm">
                  View terms
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Learn about our privacy practices
                </p>
                <button className="text-[#ff6600] hover:underline text-sm">
                  View policy
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a settings category</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-64 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account preferences</p>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                        activeTab === tab.id
                          ? 'bg-[#ff6600] text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}