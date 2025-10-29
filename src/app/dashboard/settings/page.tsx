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
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { secureStorage } from '../../../lib/auth-context';
import { useTranslation } from '@/lib/i18n-context';

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

interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'bank_account' | 'card';
  provider: string;
  lastFour?: string;
  phoneNumber?: string;
  accountName?: string;
  isDefault: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface SettingsComponentProps {
  initialAgentInfo?: AgentInfo;
}

export default function SettingsComponent(props?: any) {
  const { t } = useTranslation();
  const initialAgentInfo: AgentInfo | undefined = props?.initialAgentInfo;
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketing: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    activityStatus: true,
    personalizedAds: false
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'mobile_money' as 'mobile_money' | 'bank_account' | 'card',
    provider: '',
    phoneNumber: '',
    accountName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
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

  // Mock data for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'mobile_money',
      provider: 'MTN Mobile Money',
      phoneNumber: '078****123',
      isDefault: true
    },
    {
      id: '2',
      type: 'bank_account',
      provider: 'Bank of Kigali',
      accountName: 'John Doe',
      lastFour: '7890',
      isDefault: false
    }
  ]);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' }
  ];

  // Load all settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load agent info from secureStorage
        const userData = secureStorage.getUserData();
        if (userData) {
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

          setEditForm({
            firstName,
            lastName,
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || ''
          });
        } else if (initialAgentInfo) {
          setAgentInfo(initialAgentInfo);
          setEditForm({
            firstName: initialAgentInfo.firstName,
            lastName: initialAgentInfo.lastName,
            email: initialAgentInfo.email,
            phoneNumber: initialAgentInfo.phoneNumber
          });
        }

        // Load appearance settings
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkMode(savedDarkMode === 'true');
        }

        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
          setFontSize(savedFontSize);
        }

        // Load language preference
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }

        // Load notification preferences
        const savedNotifications = localStorage.getItem('notificationPreferences');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }

        // Load privacy settings
        const savedPrivacy = localStorage.getItem('privacySettings');
        if (savedPrivacy) {
          setPrivacySettings(JSON.parse(savedPrivacy));
        }

        // Load 2FA setting
        const saved2FA = localStorage.getItem('twoFactorEnabled');
        if (saved2FA !== null) {
          setTwoFactorEnabled(saved2FA === 'true');
        }

        // Load payment methods
        const savedPayments = localStorage.getItem('paymentMethods');
        if (savedPayments) {
          setPaymentMethods(JSON.parse(savedPayments));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
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

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = 
      fontSize === 'small' ? '14px' : 
      fontSize === 'large' ? '18px' : '16px';
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
  }, [privacySettings]);

  useEffect(() => {
    localStorage.setItem('twoFactorEnabled', twoFactorEnabled.toString());
  }, [twoFactorEnabled]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

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

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPaymentMethod(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const accessToken = secureStorage.getAccessToken();
      
  const response = await fetch('https://core-api.ddin.rw/v1/agency/profile/update', {
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
          setAgentInfo(prev => ({
            ...prev,
            ...editForm
          }));
          setIsEditing(false);
          
          const currentUserData = secureStorage.getUserData();
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
          alert(t('settings.profileUpdatedSuccess'));
        }
      } else {
        throw new Error(t('settings.profileUpdateFailed'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('settings.profileUpdateError'));
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert(t('settings.passwordsDoNotMatch'));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert(t('settings.passwordTooShort'));
      return;
    }

    try {
      const accessToken = secureStorage.getAccessToken();
      
  const response = await fetch('https://core-api.ddin.rw/v1/agency/profile/change-password', {
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
          alert(t('settings.passwordUpdatedSuccess'));
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          alert(result.message || t('settings.passwordUpdateFailed'));
        }
      } else {
        throw new Error(t('settings.passwordUpdateFailed'));
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert(t('settings.passwordUpdateError'));
    }
  };

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePrivacyToggle = (type: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleProfileVisibilityChange = (visibility: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      profileVisibility: visibility
    }));
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.provider) {
      alert(t('settings.selectProvider'));
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentMethod.type,
      provider: newPaymentMethod.provider,
      isDefault: paymentMethods.length === 0
    };

    if (newPaymentMethod.type === 'mobile_money') {
      newMethod.phoneNumber = newPaymentMethod.phoneNumber;
    } else if (newPaymentMethod.type === 'bank_account') {
      newMethod.accountName = newPaymentMethod.accountName;
      newMethod.lastFour = newPaymentMethod.accountName?.slice(-4);
    } else if (newPaymentMethod.type === 'card') {
      newMethod.lastFour = newPaymentMethod.cardNumber?.slice(-4);
    }

    setPaymentMethods(prev => [...prev, newMethod]);
    setIsAddingPayment(false);
    setNewPaymentMethod({
      type: 'mobile_money',
      provider: '',
      phoneNumber: '',
      accountName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    alert(t('settings.paymentMethodAdded'));
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDeletePayment = (id: string) => {
    if (paymentMethods.find(m => m.id === id)?.isDefault) {
      alert(t('settings.cannotDeleteDefault'));
      return;
    }
    
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    alert(t('settings.paymentMethodDeleted'));
  };

  const handleTwoFactorToggle = async () => {
    try {
      const accessToken = secureStorage.getAccessToken();
      
  const response = await fetch('https://core-api.ddin.rw/v1/agency/profile/two-factor', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enable: !twoFactorEnabled
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTwoFactorEnabled(!twoFactorEnabled);
          alert(t('settings.twoFactorToggled', { status: !twoFactorEnabled ? t('settings.enabled') : t('settings.disabled') }));
        } else {
          alert(result.message || t('settings.twoFactorUpdateFailed'));
        }
      } else {
        throw new Error(t('settings.twoFactorUpdateFailed'));
      }
    } catch (error) {
      console.error('Error updating two-factor authentication:', error);
      alert(t('settings.twoFactorUpdateError'));
    }
  };

  const tabs = [
    { id: 'profile', label: t('settings.tabs.profile'), icon: <FiUser /> },
    { id: 'security', label: t('settings.tabs.security'), icon: <FiLock /> },
    { id: 'appearance', label: t('settings.tabs.appearance'), icon: <FiMoon /> },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: <FiBell /> },
    { id: 'privacy', label: t('settings.tabs.privacy'), icon: <FiShield /> },
    { id: 'payment', label: t('settings.tabs.payment'), icon: <FiCreditCard /> },
    { id: 'language', label: t('settings.tabs.language'), icon: <FiGlobe /> },
    { id: 'help', label: t('settings.tabs.help'), icon: <FiHelpCircle /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.profileInformation')}</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-lg transition"
              >
                {isEditing ? <FiSave className="w-4 h-4" /> : <FiEdit className="w-4 h-4" />}
                {isEditing ? t('settings.saveChanges') : t('settings.editProfile')}
              </button>
            </div>

            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.firstName')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.lastName')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.lastName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.email')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.phoneNumber')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.phoneNumber}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.agencyName')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.agencyName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.agencyCode')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {agentInfo.agencyCode}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.status')}
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
                      {t('settings.role')}
                    </label>
                    <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white capitalize">
                      {agentInfo.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('settings.firstName')}
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
                    {t('settings.lastName')}
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
                    {t('settings.email')}
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
                    {t('settings.phoneNumber')}
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
                    {t('settings.saveChanges')}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    {t('settings.cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.changePassword')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.currentPassword')}
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
                  {t('settings.newPassword')}
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
                  {t('settings.confirmNewPassword')}
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
              {t('settings.updatePassword')}
            </button>

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('settings.twoFactorAuth')}</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {twoFactorEnabled ? t('settings.twoFactorEnabled') : t('settings.twoFactorDisabled')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {twoFactorEnabled 
                      ? t('settings.twoFactorProtected')
                      : t('settings.twoFactorAdd')
                    }
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={handleTwoFactorToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#ff6600]"></div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.appearance')}</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? <FiMoon className="text-[#ff6600]" /> : <FiSun className="text-[#ff6600]" />}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{t('settings.darkMode')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {darkMode ? t('settings.darkThemeEnabled') : t('settings.lightThemeEnabled')}
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
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('settings.fontSize')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-2 px-4 border rounded-lg text-center transition capitalize ${
                      fontSize === size
                        ? 'border-[#ff6600] bg-[#ff6600] text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {t(`settings.${size}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.notificationPreferences')}</h2>
            
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                    {t(`settings.notifications.${key}`)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {value ? t('settings.enabled') : t('settings.disabled')}
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.privacySettings')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('settings.profileVisibility')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['public', 'private', 'contacts'].map((visibility) => (
                    <button
                      key={visibility}
                      onClick={() => handleProfileVisibilityChange(visibility)}
                      className={`py-2 px-4 border rounded-lg text-center transition capitalize ${
                        privacySettings.profileVisibility === visibility
                          ? 'border-[#ff6600] bg-[#ff6600] text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t(`settings.${visibility}`)}
                    </button>
                  ))}
                </div>
              </div>

              {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                      {t(`settings.privacy.${key}`)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value ? t('settings.enabled') : t('settings.disabled')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={() => handlePrivacyToggle(key as keyof typeof privacySettings)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#ff6600]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.paymentMethods')}</h2>
              <button
                onClick={() => setIsAddingPayment(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-lg transition"
              >
                <FiPlus className="w-4 h-4" />
                {t('settings.addPaymentMethod')}
              </button>
            </div>

            {isAddingPayment && (
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{t('settings.addNewPaymentMethod')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.type')}
                    </label>
                    <select
                      name="type"
                      value={newPaymentMethod.type}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="mobile_money">{t('settings.mobileMoney')}</option>
                      <option value="bank_account">{t('settings.bankAccount')}</option>
                      <option value="card">{t('settings.creditDebitCard')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.provider')}
                    </label>
                    <input
                      type="text"
                      name="provider"
                      value={newPaymentMethod.provider}
                      onChange={handlePaymentInputChange}
                      placeholder={newPaymentMethod.type === 'mobile_money' ? 'e.g., MTN, Airtel' : newPaymentMethod.type === 'bank_account' ? 'e.g., Bank of Kigali' : 'e.g., Visa, MasterCard'}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {newPaymentMethod.type === 'mobile_money' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={newPaymentMethod.phoneNumber}
                        onChange={handlePaymentInputChange}
                        placeholder="0781234567"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  {newPaymentMethod.type === 'bank_account' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.accountName')}
                      </label>
                      <input
                        type="text"
                        name="accountName"
                        value={newPaymentMethod.accountName}
                        onChange={handlePaymentInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  {newPaymentMethod.type === 'card' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('settings.cardNumber')}
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={newPaymentMethod.cardNumber}
                          onChange={handlePaymentInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('settings.expiryDate')}
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={newPaymentMethod.expiryDate}
                          onChange={handlePaymentInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('settings.cvv')}
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={newPaymentMethod.cvv}
                          onChange={handlePaymentInputChange}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleAddPaymentMethod}
                    className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg transition"
                  >
                    {t('settings.addMethod')}
                  </button>
                  <button 
                    onClick={() => setIsAddingPayment(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    {t('settings.cancel')}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#ff6600] rounded-lg flex items-center justify-center">
                      <FiCreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                        {t(`settings.${method.type.replace('_', '')}`)} - {method.provider}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.type === 'mobile_money' && method.phoneNumber && `${t('settings.phone')}: ${method.phoneNumber}`}
                        {method.type === 'bank_account' && method.accountName && `${t('settings.account')}: ${method.accountName}`}
                        {method.type === 'card' && method.lastFour && `${t('settings.card')}: **** ${method.lastFour}`}
                      </p>
                      {method.isDefault && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                          {t('settings.default')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefaultPayment(method.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Set as default"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(method.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.languagePreferences')}</h2>
            
            <div className="space-y-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition ${
                    language === lang.code
                      ? 'bg-[#ff6600] text-white'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-left">
                    <h3 className="font-medium">{lang.name}</h3>
                    <p className="text-sm opacity-75">{lang.nativeName}</p>
                  </div>
                  {language === lang.code && (
                    <FiCheck className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'help':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.helpSupport')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('settings.contactSupport')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('settings.getSupportHelp')}
                </p>
                <div className="space-y-2 text-sm">
                  <p>📞 <strong>{t('settings.phone')}:</strong> +250 788 123 456</p>
                  <p>✉️ <strong>{t('settings.email')}:</strong> support@xpay.com</p>
                  <p>💬 <strong>{t('settings.liveChat')}:</strong> {t('settings.available247')}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('settings.faq')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('settings.frequentlyAskedQuestions')}
                </p>
                <div className="space-y-2 text-sm">
                  <p>• {t('settings.howToResetPassword')}</p>
                  <p>• {t('settings.howToUpdateProfile')}</p>
                  <p>• {t('settings.transactionIssues')}</p>
                  <p>• {t('settings.commissionQueries')}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg md:col-span-2">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('settings.documentation')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('settings.userGuidesAndDocs')}
                </p>
                <div className="flex gap-3">
                  <button className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-4 py-2 rounded-lg text-sm transition">
                    {t('settings.userGuide')}
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition">
                    {t('settings.apiDocumentation')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>{t('settings.selectCategory')}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-64 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.settings')}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('settings.managePreferences')}</p>
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
