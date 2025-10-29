import type { Metadata } from "next";
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n-context";
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "X-pay",
  description: "Implemented By DDIN Team",
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
