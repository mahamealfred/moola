'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextTheme);
  };

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
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
            <PasswordInput label="Password" name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} />
          </>
        );
      case 2:
        return (
          <>
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </>
        );
      case 3:
        return (
          <>
            <Input label="National ID / Passport" name="identity" value={formData.identity} onChange={handleChange} />
            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 relative overflow-hidden transition-colors">
      {/* Floating blurred backgrounds */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#13294b]/20 dark:bg-[#13294b]/30 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-64 h-64 bg-[#ff6600]/20 dark:bg-[#ff6600]/30 rounded-full blur-2xl bottom-10 right-1/4 animate-ping" />
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
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#13294b] dark:text-white">
              <span className="text-[#ff6600]">X</span>-Pay
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
          </header>

          <h2 className="text-xl font-semibold text-[#13294b] dark:text-white">Create your account</h2>

          <form className="space-y-5" onSubmit={e => e.preventDefault()}>
            {renderStep()}

            <div className="flex justify-between items-center">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-[#13294b] dark:bg-[#ff6600] hover:bg-[#0f213d] dark:hover:bg-[#e65c00] text-white font-semibold py-3 px-6 rounded-2xl transition shadow-lg hover:shadow-xl"
              >
                {step < 3 ? 'Next' : 'Register'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#13294b] dark:text-[#ff6600] font-medium hover:underline">
                Sign In
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
            Join X-pay Today
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-lg font-medium max-w-md"
          >
            Create an account and start accessing secure, agent-powered financial services with ease and speed.
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

function PasswordInput({ label, name, value, onChange, showPassword, setShowPassword }: any) {
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
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}
