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
      <body className={`${inter.className} bg-stellar-dark text-white antialiased`}>
        {children}
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            style: {
              background: '#161421',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          }}
        />
      </body>
    </html>
  );
}
