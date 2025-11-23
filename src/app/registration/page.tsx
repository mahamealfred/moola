'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 relative overflow-hidden transition-colors">
      {/* Animated Gradient Orb Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.1, 1],
            x: [20, -20, 20],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#ff6600] to-[#ff8c00] blur-3xl opacity-20"
        />
        
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.15, 1],
            x: [-20, 20, -20],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#13294b] to-[#1e3a5f] blur-3xl opacity-15"
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255, 102, 0) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
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
