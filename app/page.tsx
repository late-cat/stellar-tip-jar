"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { stellar } from "@/lib/stellar-helper";

const WalletConnect = dynamic(() => import("@/components/WalletConnect"), { ssr: false });
const TipJarCard = dynamic(() => import("@/components/TipJarCard"), { ssr: false });

// Placeholder Testnet Public Key (User should replace this with their own or pass via env/props)
const RECEIVER_PUBLIC_KEY = process.env.NEXT_PUBLIC_RECEIVER_KEY || "GAYPCDGQ2MT3COTCRZW3YX2WHA2W2YYTUVOGFN7AXZ3GYHT72ICXK6KA";

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (publicKey) {
      updateBalance(publicKey);
    } else {
      setBalance(null);
    }
  }, [publicKey]);

  const updateBalance = async (key: string) => {
    try {
      const { xlm } = await stellar.getBalance(key);
      setBalance(xlm);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    if (publicKey) updateBalance(publicKey);
    setTimeout(() => setIsSuccess(false), 5000); // Hide success overlay after 5s
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-stellar-purple/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-stellar-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stellar-purple to-stellar-accent flex items-center justify-center shadow-lg shadow-stellar-purple/30">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            StellaTip
          </h1>
        </div>
        <WalletConnect 
          onConnect={setPublicKey} 
          onDisconnect={() => setPublicKey(null)} 
          connectedKey={publicKey}
          balance={balance}
        />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-7xl mx-auto">
        {isSuccess && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2 shadow-black drop-shadow-md">Thank You!</h2>
              <p className="text-white/80 shadow-black drop-shadow-md">Your tip has been sent to the creator.</p>
            </div>
          </motion.div>
        )}
        
        <TipJarCard 
          receiverPublicKey={RECEIVER_PUBLIC_KEY} 
          senderPublicKey={publicKey}
          onSuccess={handleSuccess}
        />
        
        <p className="mt-12 text-white/30 text-sm text-center">
          Built on the <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-stellar-purple-light hover:text-stellar-accent transition-colors">Stellar Network</a>
        </p>
      </div>
    </main>
  );
}
