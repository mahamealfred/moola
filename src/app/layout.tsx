import type { Metadata } from "next";
import '../styles/globals.css';
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from 'react-hot-toast';


export const metadata: Metadata = {
  title: "X-pay",
  description: "Implemented By DDIN Team",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
<html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
         <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
    </AuthProvider>
    
  );
}