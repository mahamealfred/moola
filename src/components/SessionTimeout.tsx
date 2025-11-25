'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export default function SessionTimeout({ 
  timeoutMinutes = 5, 
  warningMinutes = 1
}: SessionTimeoutProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const { logout } = useAuth();
  const router = useRouter();
  
  const timeoutIdRef = useRef<number | undefined>(undefined);
  const warningTimeoutIdRef = useRef<number | undefined>(undefined);
  const countdownIntervalRef = useRef<number | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  const clearAllTimers = useCallback(() => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  const handleLogout = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    logout();
    router.push('/login?reason=session-expired');
  }, [clearAllTimers, logout, router]);

  const startCountdown = useCallback(() => {
    const warningDuration = 30; // 30 seconds warning before logout
    setSecondsRemaining(warningDuration);
    
    countdownIntervalRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  }, [timeoutMinutes, warningMinutes, clearAllTimers, handleLogout]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    lastActivityRef.current = Date.now();

    console.log('[SessionTimeout] Timer reset - Warning in', warningMinutes, 'minutes, Logout in', timeoutMinutes, 'minutes');

    // Set warning timeout (1.5 minutes = 90 seconds)
    warningTimeoutIdRef.current = window.setTimeout(() => {
      console.log('[SessionTimeout] ⚠️ Showing warning - User has been idle for', warningMinutes, 'minutes');
      setShowWarning(true);
      startCountdown();
    }, warningMinutes * 60 * 1000) as number;

    // Set logout timeout (2 minutes = 120 seconds)
    timeoutIdRef.current = window.setTimeout(() => {
      console.log('[SessionTimeout] 🔒 Logging out - User has been idle for', timeoutMinutes, 'minutes');
      handleLogout();
    }, timeoutMinutes * 60 * 1000) as number;
  }, [clearAllTimers, warningMinutes, timeoutMinutes, startCountdown, handleLogout]);

  const handleContinue = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle activity detection to avoid excessive timer resets
    let throttleTimeout: number | undefined;
    const handleActivity = () => {
      // Don't reset timer if warning is already showing
      if (showWarning) return;
      
      const now = Date.now();
      // Only reset if last activity was more than 1 second ago (throttle)
      if (now - lastActivityRef.current > 1000) {
        if (throttleTimeout) clearTimeout(throttleTimeout);
        throttleTimeout = window.setTimeout(() => {
          console.log('[SessionTimeout] 👆 User activity detected - Resetting timer');
          resetTimer();
        }, 500) as number;
      }
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    console.log('[SessionTimeout] 🚀 Session timeout initialized');
    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearAllTimers();
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [resetTimer, clearAllTimers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-orange-500/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with animated warning icon */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"
                  />
                </div>
                
                <div className="relative z-10 flex items-center gap-4">
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"
                  >
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold">Session Timeout Warning</h2>
                    <p className="text-white/90 text-sm">Your session is about to expire</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Countdown Timer */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-4 border-orange-500/30 relative">
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-orange-500"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + 50 * Math.cos((secondsRemaining / 30) * 2 * Math.PI - Math.PI / 2)
                        }% ${
                          50 + 50 * Math.sin((secondsRemaining / 30) * 2 * Math.PI - Math.PI / 2)
                        }%, 50% 50%)`
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity
                      }}
                    />
                    <div className="relative z-10 text-center">
                      <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {formatTime(secondsRemaining)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="text-center space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    You've been inactive for a while
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For your security, we'll automatically log you out in <span className="font-semibold text-orange-600 dark:text-orange-400">{formatTime(secondsRemaining)}</span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{
                      duration: secondsRemaining,
                      ease: 'linear'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8c00] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Continue Session
                  </motion.button>
                </div>

                {/* Security Note */}
                <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This is a security feature to protect your account
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
