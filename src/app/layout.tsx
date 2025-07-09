import type { Metadata } from "next";
import '../styles/globals.css';


export const metadata: Metadata = {
  title: "Moola",
  description: "Implemented By DDIN Team",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}