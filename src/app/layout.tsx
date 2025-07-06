import type { Metadata } from "next";
import '../styles/globals.css';


export const metadata: Metadata = {
  title: "X-pay",
  description: "Implemented By DDIN Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
      <body>{children}</body>
    </html>
  );
}
