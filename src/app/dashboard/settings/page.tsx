'use client';

import React, { useState, useEffect } from 'react';
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
  FiEyeOff,
  FiSave,
  FiEdit
} from 'react-icons/fi';
import { secureStorage } from '../../../lib/auth-context';

interface AgentInfo {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  agencyName: string;
  agencyCode: string;
  status: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

interface SettingsComponentProps {
  initialAgentInfo?: AgentInfo;
}

export default function SettingsComponent({ initialAgentInfo }: SettingsComponentProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    agencyName: '',
    agencyCode: '',
    status: '',
    role: '',
    createdAt: '',
    lastLogin: ''
  });
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  // Load agent info from secureStorage on component mount
  useEffect(() => {
    const loadAgentInfo = () => {
      try {
        // Try to get agent info from secureStorage (from login response)
        const userData = secureStorage.getUserData();
        if (userData) {
          // userData comes from secureStorage and may have a single `name` field.
          // Split name into first/last where possible and provide sensible defaults.
          const nameParts = (userData.name || '').split(' ');
          const firstName = nameParts.shift() || '';
          const lastName = nameParts.join(' ') || '';

          setAgentInfo({
            id: userData.id ?? '',
            firstName,
            lastName,
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            agencyName: (userData as any).agencyName || '',
            agencyCode: (userData as any).agencyCode || '',
            status: (userData as any).status || 'active',
            role: userData.category || 'agent',
            createdAt: (userData as any).createdAt || '',
            lastLogin: (userData as any).lastLogin || new Date().toISOString()
          });

          // Initialize edit form with current data
          setEditForm({
            firstName,
            lastName,
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || ''
          });
        } else if (initialAgentInfo) {
          // Fallback to initial props
          setAgentInfo(initialAgentInfo);
          setEditForm({
            firstName: initialAgentInfo.firstName,
            lastName: initialAgentInfo.lastName,
            email: initialAgentInfo.email,
            phoneNumber: initialAgentInfo.phoneNumber
          });
        }

        // Load dark mode preference from localStorage
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
          document.documentElement.classList.add('dark');
        }

        // Load notification preferences from localStorage
        const savedNotifications = localStorage.getItem('notificationPreferences');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadAgentInfo();
  }, [initialAgentInfo]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Save notification preferences
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
  }, [notifications]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would typically make an API call to update the agent info
      const accessToken = secureStorage.getAccessToken();
      
      const response = await fetch('http://localhost:4000/v1/agency/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedData = await response.json();
        if (updatedData.success) {
          // Update local state with new data
          setAgentInfo(prev => ({
            ...prev,
            ...editForm
          }));
          setIsEditing(false);
          
          // Update secureStorage with new data
          const currentUserData = secureStorage.getUserData();
          // retrieve token data from sessionStorage if available
          let accessToken = '';
          let refreshToken = '';
          try {
            const encrypted = sessionStorage.getItem('at');
            if (encrypted) {
              const tokenObj = JSON.parse((window as any).atob(encrypted));
              accessToken = tokenObj.accessToken || '';
              refreshToken = tokenObj.refreshToken || '';
            }
          } catch {
            // ignore
          }

          // Build a payload compatible with secureStorage.setUserData
          const payload = {
            id: (currentUserData as any)?.id,
            name: `${editForm.firstName} ${editForm.lastName}`,
            email: editForm.email,
            phoneNumber: editForm.phoneNumber,
            category: (currentUserData as any)?.category,
            accessToken,
            refreshToken
          } as any;

          secureStorage.setUserData(payload);

          alert('Profile updated successfully!');
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const accessToken = secureStorage.getAccessToken();
      
      const response = await fetch('http://localhost:4000/v1/agency/profile/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Password updated successfully!');
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          alert(result.message || 'Failed to update password');
        }
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-lg transition"
              >
                {isEditing ? <FiSave className="w-4 h-4" /> : <FiEdit className="w-4 h-4" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {/* Read-only Information */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.lastName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.phoneNumber}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Agency Name
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.agencyName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Agency Code
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.agencyCode}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        agentInfo.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {agentInfo.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white capitalize">
                      {agentInfo.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editable Form */}
            {isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2 flex gap-3">
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg transition"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
            <button 
              onClick={handlePasswordUpdate}
              className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg transition"
            >
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
      
      // ... rest of the cases remain the same as your original code
      // (privacy, payment, language, help)
      
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