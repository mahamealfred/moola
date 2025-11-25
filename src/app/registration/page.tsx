'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n-context';
export const runtime = "edge";

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    identity: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => step < 3 ? setStep(prev => prev + 1) : handleSubmit();
  const handleBack = () => setStep(prev => prev - 1);
  const handleSubmit = () => {
    console.log('Registration submitted:', formData);
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input label={t('registration.email')} name="email" type="email" value={formData.email} onChange={handleChange} />
            <Input label={t('registration.username')} name="username" value={formData.username} onChange={handleChange} />
            <PasswordInput label={t('registration.password')} name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} t={t} />
          </>
        );
      case 2:
        return (
          <>
            <Input label={t('registration.firstName')} name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label={t('registration.lastName')} name="lastName" value={formData.lastName} onChange={handleChange} />
          </>
        );
      case 3:
        return (
          <>
            <Input label={t('registration.identity')} name="identity" value={formData.identity} onChange={handleChange} />
            <Input label={t('registration.phoneNumber')} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors duration-700 relative overflow-x-hidden">
      {/* Payment & Money Transfer Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated Money Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5">
          <defs>
            <linearGradient id="moneyFlowReg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6600" />
              <stop offset="50%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#2196F3" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,100 Q250,50 500,100 T1000,100"
            stroke="url(#moneyFlowReg)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M0,300 Q250,250 500,300 T1000,300"
            stroke="url(#moneyFlowReg)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </svg>

        {/* Floating Payment Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 flex items-center justify-center backdrop-blur-sm border border-green-400/30">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500/40" />
            </div>
          </motion.div>
        ))}

        {/* Card/Wallet Icons */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`wallet-${i}`}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
            style={{
              right: `${5 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
          >
            <CreditCard className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500/30" />
          </motion.div>
        ))}

        {/* Transfer Arrow Paths */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 sm:w-48"
          animate={{ x: [0, 100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Send className="w-8 h-8 sm:w-12 sm:h-12 text-orange-500/30" />
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-400/10 to-blue-500/10 dark:from-green-400/5 dark:to-blue-500/5 blur-3xl rounded-full top-20 left-10 animate-pulse"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-orange-400/10 to-purple-500/10 dark:from-orange-400/5 dark:to-purple-500/5 blur-3xl rounded-full bottom-20 right-10 animate-pulse"
        />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Card container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Left: Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 space-y-6"
        >
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#13294b] dark:text-white">
              <span className="text-[#ff6600]">M</span>oola<span className="text-[#ff6600] text-lg align-super">+</span>
            </h1>
          </header>

          <h2 className="text-xl font-semibold text-[#13294b] dark:text-white">{t('registration.title')}</h2>

          <form className="space-y-5" onSubmit={e => e.preventDefault()}>
            {renderStep()}

            <div className="flex justify-between items-center">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                  {t('registration.back')}
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-gradient-to-r from-[#ff6600] to-[#ff8c00] hover:from-[#e65c00] hover:to-[#e65c00] text-white font-semibold py-3 px-6 rounded-2xl transition shadow-lg hover:shadow-xl"
              >
                {step < 3 ? t('registration.next') : t('registration.register')}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('registration.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-[#ff6600] font-medium hover:underline">
                {t('registration.signIn')}
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Right: Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            scale: 1.01,
            transition: { repeat: Infinity, repeatType: 'reverse', duration: 1.5, ease: 'easeInOut' },
          }}
          className="hidden md:flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#13294b] via-[#0f213d] to-[#ff6600] dark:from-[#13294b] dark:to-[#ff6600] text-white px-10 py-12"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-4xl font-extrabold mb-4"
          >
            {t('registration.welcomeTitle')}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-lg font-medium max-w-md"
          >
            {t('registration.welcomeDescription')}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ label, name, type = 'text', value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#ff6600]"
        required
      />
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, showPassword, setShowPassword, t }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full px-4 py-3 pr-10 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#ff6600]"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#ff6600] hover:text-[#e65c00]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? t('registration.hide') : t('registration.show')}
        </button>
      </div>
    </div>
  );
}
