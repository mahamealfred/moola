// Initialize storage polyfills FIRST - before any other imports
import '@/lib/storage-init';

import type { Metadata } from "next";
import { Suspense, lazy } from 'react';
import '../styles/globals.css';
import { ToasterProvider } from '@/components/ToasterProvider';
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n-context";
import { StoragePolyfill } from "@/components/StoragePolyfill";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Moola+ | Rwanda's Leading Payment Platform",
  description: "Moola+ is Rwanda's premier digital payment platform offering seamless bill payments, airtime top-ups, mobile money transfers, agency banking services, and business solutions. Fast, secure, and reliable payment services for individuals and businesses across Rwanda.",
  icons: {
    icon: '/moola-icon.svg',
    apple: '/moola-icon.svg',
    shortcut: '/moola-icon.svg',
  },
  // Preload critical resources
  other: {
    'prefetch': '/logos/services/aqs.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link rel="preload" as="font" href="/fonts/Inter-var.woff2" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//localhost:4000" />
        <link rel="dns-prefetch" href="//api.example.com" />

        <script dangerouslySetInnerHTML={{
          __html: `
            // Initialize storage polyfills SYNCHRONOUSLY before React loads
            (function() {
              if (typeof window === 'undefined') return;
              
              // Fix localStorage
              if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
                const mockStorage = {};
                window.localStorage = {
                  getItem: (key) => mockStorage[key] ?? null,
                  setItem: (key, value) => {
                    mockStorage[key] = String(value);
                  },
                  removeItem: (key) => {
                    delete mockStorage[key];
                  },
                  clear: () => {
                    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
                  },
                  key: (index) => Object.keys(mockStorage)[index] ?? null,
                  length: Object.keys(mockStorage).length,
                };
              }
              
              // Fix sessionStorage
              if (!window.sessionStorage || typeof window.sessionStorage.getItem !== 'function') {
                const mockSessionStorage = {};
                window.sessionStorage = {
                  getItem: (key) => mockSessionStorage[key] ?? null,
                  setItem: (key, value) => {
                    mockSessionStorage[key] = String(value);
                  },
                  removeItem: (key) => {
                    delete mockSessionStorage[key];
                  },
                  clear: () => {
                    Object.keys(mockSessionStorage).forEach(key => delete mockSessionStorage[key]);
                  },
                  key: (index) => Object.keys(mockSessionStorage)[index] ?? null,
                  length: Object.keys(mockSessionStorage).length,
                };
              }
            })();
          `,
        }} />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900" />}>
          <StoragePolyfill />
          <I18nProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
          <ToasterProvider />
        </Suspense>
      </body>
    </html>
  );
}
