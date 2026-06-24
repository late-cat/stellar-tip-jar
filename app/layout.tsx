import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellar Tip Jar",
  description: "An iconic, decentralized tip jar built on the Stellar network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#2C2A26',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
            }
          }}
        />
      </body>
    </html>
  );
}
