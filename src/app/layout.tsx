import type { Metadata } from "next";
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n-context";
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
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
<html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
         <I18nProvider>
           <AuthProvider>
             {children}
           </AuthProvider>
         </I18nProvider>
       
         <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  
    
  );
}
