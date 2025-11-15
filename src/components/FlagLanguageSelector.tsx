'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n-context';
import type { Locale } from '@/lib/translations';

// Flag Components
const RwandaFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#20AADD"/>
    <rect width="24" height="5.33" fill="#00A1DE"/>
    <rect y="5.33" width="24" height="5.34" fill="#FFD100"/>
    <rect y="10.67" width="24" height="5.33" fill="#00A651"/>
    <circle cx="6" cy="5.33" r="2" fill="#FFD100"/>
    <path d="M6 3.5L6.5 4.5L7.5 4.3L7 5.2L7.8 5.8L6.8 6L6.5 7L6 6L5.2 6.2L5.8 5.5L5 4.8L6 5L6 3.5Z" fill="#00A1DE"/>
  </svg>
);

const FranceFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="8" height="16" fill="#002654"/>
    <rect x="8" width="8" height="16" fill="#FFFFFF"/>
    <rect x="16" width="8" height="16" fill="#ED2939"/>
  </svg>
);

const UKFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="2"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1"/>
    <rect x="10" y="0" width="4" height="16" fill="#FFFFFF"/>
    <rect y="6" width="24" height="4" fill="#FFFFFF"/>
    <rect x="11" y="0" width="2" height="16" fill="#C8102E"/>
    <rect y="7" width="24" height="2" fill="#C8102E"/>
  </svg>
);

const languages = [
  { 
    code: 'rw' as Locale, 
    name: 'Kinyarwanda', 
    flag: RwandaFlag,
    country: 'Rwanda'
  },
  { 
    code: 'fr' as Locale, 
    name: 'Français', 
    flag: FranceFlag,
    country: 'France'
  },
  { 
    code: 'en' as Locale, 
    name: 'English', 
    flag: UKFlag,
    country: 'United Kingdom'
  },
];

export default function FlagLanguageSelector() {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        aria-label="Select language"
        title={`Current language: ${currentLanguage.name} (${currentLanguage.country})`}
      >
        <currentLanguage.flag className="w-7 h-5 rounded-sm" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[200px]"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  locale === language.code
                    ? 'bg-[#ff660010] dark:bg-[#ff660020] text-[#ff6600] border-l-4 border-[#ff6600]'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <language.flag className="w-6 h-4 rounded-sm flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-xs opacity-75">{language.country}</span>
                </div>
                {locale === language.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-[#ff6600] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}