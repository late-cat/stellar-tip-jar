"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { stellar } from "@/lib/stellar-helper";
import toast from "react-hot-toast";
import { Copy, Check, Send, Coffee, Star, Heart } from "lucide-react";
import clsx from "clsx";

interface TipJarCardProps {
  receiverPublicKey: string;
  senderPublicKey: string | null;
  onSuccess: () => void;
}

const PRESET_AMOUNTS = [
  { value: "10", icon: Coffee, label: "Coffee" },
  { value: "50", icon: Star, label: "Awesome" },
  { value: "100", icon: Heart, label: "Hero" },
];

export default function TipJarCard({ receiverPublicKey, senderPublicKey, onSuccess }: TipJarCardProps) {
  const [amount, setAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(receiverPublicKey);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!senderPublicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    const finalAmount = customAmount || amount;
    if (!finalAmount || isNaN(Number(finalAmount)) || Number(finalAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      setIsSending(true);
      const loadingToast = toast.loading("Awaiting signature...");
      
      const result = await stellar.sendPayment({
        from: senderPublicKey,
        to: receiverPublicKey,
        amount: finalAmount,
        memo: "Tip Jar Support",
      });

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Tip sent successfully! 🎉</span>
            <a 
              href={stellar.getExplorerLink(result.hash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-stellar-accent underline"
            >
              View on Explorer
            </a>
          </div>, 
          { duration: 5000 }
        );
        setCustomAmount("");
        onSuccess();
      } else {
        throw new Error("Transaction failed on the network.");
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Transaction failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl glass-panel overflow-hidden shadow-2xl relative z-10"
    >
      <div className="bg-white/5 p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-stellar-purple/20 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative bg-white p-4 rounded-2xl shadow-xl mb-6 ring-4 ring-white/10 transition-transform hover:scale-105 duration-300">
          <QRCodeSVG 
            value={receiverPublicKey}
            size={200}
            bgColor="#ffffff"
            fgColor="#0B0A11"
            level="Q"
            includeMargin={false}
          />
        </div>

        <div className="text-center w-full z-10">
          <p className="text-white/60 text-sm mb-2 font-medium">SCAN TO DONATE ANY ASSET</p>
          <div 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-black/20 hover:bg-black/40 px-4 py-3 rounded-xl cursor-pointer transition-colors border border-white/5 group"
          >
            <span className="font-mono text-sm tracking-wider text-white/90">
              {stellar.formatAddress(receiverPublicKey, 8, 8)}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
            )}
          </div>
        </div>
      </div>

      <div className="p-10 flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Support the Creator</h2>
          <p className="text-white/50 text-sm">Send some XLM to show your appreciation. It's fast, secure, and helps keep the lights on.</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = amount === preset.value && !customAmount;
              return (
                <button
                  key={preset.value}
                  onClick={() => {
                    setAmount(preset.value);
                    setCustomAmount("");
                  }}
                  className={clsx(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200",
                    isSelected 
                      ? "bg-stellar-purple/20 border-stellar-purple-light shadow-[0_0_15px_rgba(90,49,244,0.3)]" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <Icon className={clsx("w-6 h-6 mb-2", isSelected ? "text-stellar-accent" : "text-white/60")} />
                  <span className="font-semibold">{preset.value} XLM</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 mt-1">{preset.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-white/40 font-medium">Custom</span>
            </div>
            <input
              type="number"
              min="1"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setAmount("");
              }}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-20 pr-16 text-right font-mono text-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-stellar-accent/50 focus:border-stellar-accent transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-white/60 font-semibold">XLM</span>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || !senderPublicKey}
            className="w-full group relative overflow-hidden rounded-2xl p-[1px] disabled:opacity-50 transition-opacity"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-stellar-purple via-stellar-accent to-stellar-purple opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
            <div className="relative bg-[#1a1825] group-hover:bg-[#1a1825]/80 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors duration-300">
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 text-stellar-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="font-bold text-lg">Send {customAmount || amount} XLM</span>
                </>
              )}
            </div>
          </button>
          
          {!senderPublicKey && (
            <p className="text-center text-xs text-amber-400/80 mt-2">
              Connect your wallet to send a tip
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
