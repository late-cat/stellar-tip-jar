"use client";

import { useState, useEffect } from "react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { stellar } from "@/lib/stellar-helper";
import toast from "react-hot-toast";

interface WalletConnectProps {
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
  connectedKey: string | null;
  balance: string | null;
}

export default function WalletConnect({ onConnect, onDisconnect, connectedKey, balance }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const publicKey = await stellar.connectWallet();
      onConnect(publicKey);
      toast.success("Wallet connected!");
    } catch (error: any) {
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    stellar.disconnect();
    onDisconnect();
    setIsOpen(false);
    toast.success("Wallet disconnected");
  };

  if (!connectedKey) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 bg-stellar-purple hover:bg-stellar-purple-light transition-all text-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-full font-medium shadow-md hover:shadow-lg disabled:opacity-70"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect"}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 md:gap-3 bg-white/80 hover:bg-white border border-black/10 shadow-sm transition-all text-stellar-ink px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium backdrop-blur-md"
      >
        <div className="hidden md:block w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        <span className="text-xs md:text-sm font-semibold tracking-wide">
          {stellar.formatAddress(connectedKey)}
        </span>
        {balance && (
          <span className="text-xs md:text-sm text-stellar-ink/60 pl-2 border-l border-black/10 font-mono">
            {Number(balance).toFixed(2)} XLM
          </span>
        )}
        <ChevronDown className="hidden md:block w-4 h-4 text-stellar-ink/50" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-black/5 shadow-lg overflow-hidden py-1 z-50">
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
