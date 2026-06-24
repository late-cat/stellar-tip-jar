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
        className="flex items-center gap-2 bg-stellar-purple hover:bg-stellar-purple-light transition-all text-white px-5 py-2.5 rounded-full font-medium shadow-[0_0_15px_rgba(90,49,244,0.4)] hover:shadow-[0_0_25px_rgba(90,49,244,0.6)] disabled:opacity-70"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Freighter"}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white px-4 py-2 rounded-full font-medium backdrop-blur-md"
      >
        <div className="w-2 h-2 rounded-full bg-stellar-accent animate-pulse-glow" />
        <span className="text-sm">
          {stellar.formatAddress(connectedKey)}
        </span>
        {balance && (
          <span className="text-sm text-white/60 pl-2 border-l border-white/10">
            {Number(balance).toFixed(2)} XLM
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-white/50" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel overflow-hidden py-1 z-50">
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
