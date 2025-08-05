'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
export const runtime = "edge";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(true); // false = light mode by default
  const router = useRouter();

  // Setup theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkPreferred = savedTheme === 'dark';

    setIsDark(isDarkPreferred);
    document.documentElement.classList.toggle('dark', isDarkPreferred);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res= await fetch('http://localhost:3000/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: email,
    password: password,
  }),
});


    const result = await res.json();
    console.log("err:",result)

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Login failed');
    }

    const { accessToken, refreshToken, ...userInfo } = result.data;

    // Store tokens and user info in localStorage
  

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userInfo));

    // Optionally: You can also update context here (if you're using one)

    // Redirect
    router.push('/dashboard');
  } catch (err: any) {
    alert(err.message || 'Something went wrong during login.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      {/* Floating Background Blur Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-blue-300/30 dark:bg-blue-900/30 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-52 h-52 bg-purple-300/20 dark:bg-purple-800/20 rounded-full blur-2xl bottom-10 right-1/4 animate-ping" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
        {/* Left Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 space-y-6"
        >
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">X-pay</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </header>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sign in to your account</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Mahame"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:text-blue-600"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Do you want to become an Agent?{' '}
              <Link href="/registration" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Register
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Right: Mission Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            scale: 1.01,
            transition: {  duration: 1.5, ease: 'easeInOut' },
          }}
          className="hidden md:flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white px-10 py-12"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-4xl font-extrabold mb-4"
          >
            Welcome to X-pay
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 60 }}
            className="text-lg font-medium max-w-md"
          >
            A network of the best – empowering agents and individuals to access and offer essential financial services
            easily and securely.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
