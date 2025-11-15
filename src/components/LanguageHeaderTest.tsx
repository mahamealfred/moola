'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n-context';
import { api } from '@/lib/api-client';

export function LanguageHeaderTest() {
  const [testResult, setTestResult] = useState<string>('');
  const { locale, setLocale } = useTranslation();

  const testApiCall = async () => {
    try {
      setTestResult('Testing...');
      
      // Test API call - this will show in browser dev tools Network tab
      const response = await api.post('/test-endpoint', { 
        test: 'language header test',
        currentLocale: locale 
      });
      
      setTestResult(`Request sent to URL with ?lang=${locale} query parameter. Check browser dev tools Network tab to see the full URL.`);
    } catch (error) {
      setTestResult(`Test completed. Current language parameter: ?lang=${locale}. Check Network tab for actual request URL.`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Language Query Parameter Test
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current Language: <span className="font-mono font-bold text-[#ff6600]">{locale}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setLocale('rw')}
            className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
              locale === 'rw' 
                ? 'bg-[#ff6600] text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>🇷🇼</span>
            Kinyarwanda
          </button>
          <button
            onClick={() => setLocale('fr')}
            className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
              locale === 'fr' 
                ? 'bg-[#ff6600] text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>🇫🇷</span>
            Français
          </button>
          <button
            onClick={() => setLocale('en')}
            className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
              locale === 'en' 
                ? 'bg-[#ff6600] text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>🇬🇧</span>
            English
          </button>
        </div>
        
        <button
          onClick={testApiCall}
          className="px-4 py-2 bg-[#ff6600] text-white rounded hover:bg-[#e55a00] transition-colors"
        >
          Test API Call with Current Language
        </button>
        
        {testResult && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
            {testResult}
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Open browser dev tools (F12) → Network tab, then click "Test API Call" to see the '?lang=' parameter in the request URL.
        </div>
      </div>
    </div>
  );
}