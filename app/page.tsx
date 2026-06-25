"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { stellar } from "@/lib/stellar-helper";

const WalletConnect = dynamic(() => import("@/components/WalletConnect"), { ssr: false });
const TipJarCard = dynamic(() => import("@/components/TipJarCard"), { ssr: false });

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
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      <header className="w-full p-4 md:p-6 flex flex-wrap justify-between items-center z-20 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-stellar-purple/10 border border-stellar-purple/20 flex items-center justify-center shadow-sm">
            <Sparkles className="text-stellar-purple w-4 h-4 md:w-5 md:h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-stellar-ink font-serif italic">
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

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full max-w-7xl mx-auto">
        {isSuccess && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md pointer-events-none"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float">🎉</div>
              <h2 className="text-3xl font-bold text-stellar-ink mb-2 font-serif">Thank You!</h2>
              <p className="text-stellar-ink/80 font-medium">Your tip has been sent to the creator.</p>
            </div>
          </motion.div>
        )}
        
        <TipJarCard 
          receiverPublicKey={RECEIVER_PUBLIC_KEY} 
          senderPublicKey={publicKey}
          onSuccess={handleSuccess}
        />
        
        <p className="mt-12 text-stellar-ink/40 text-sm text-center font-medium">
          Built on the <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-stellar-purple hover:text-stellar-accent transition-colors underline decoration-dotted underline-offset-4">Stellar Network</a>
        </p>
      </div>
    </main>
  );
}
