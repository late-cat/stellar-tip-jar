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
      className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[2rem] paper-panel overflow-hidden relative z-10"
    >
      <div className="bg-black/[0.03] p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-stellar-purple/10 to-transparent opacity-60 pointer-events-none" />
        
        <div className="relative bg-white p-4 rounded-2xl shadow-sm mb-6 border border-black/5 transition-transform hover:scale-105 duration-300">
          <QRCodeSVG 
            value={receiverPublicKey}
            size={200}
            bgColor="transparent"
            fgColor="#2C2A26"
            level="Q"
            includeMargin={false}
          />
        </div>

        <div className="text-center w-full z-10">
          <p className="text-stellar-ink/50 text-sm mb-2 font-semibold tracking-wider">SCAN TO DONATE ANY ASSET</p>
          <div 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-white/80 shadow-sm hover:bg-white px-4 py-3 rounded-xl cursor-pointer transition-all border border-black/5 group"
          >
            <span className="font-mono text-sm tracking-wider text-stellar-ink/90 font-medium">
              {stellar.formatAddress(receiverPublicKey, 8, 8)}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-stellar-ink/40 group-hover:text-stellar-ink/80 transition-colors" />
            )}
          </div>
        </div>
      </div>

      <div className="p-10 flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-stellar-ink font-serif">Support the Creator</h2>
          <p className="text-stellar-ink/60 text-sm font-medium">Send some XLM to show your appreciation. It's fast, secure, and helps keep the lights on.</p>
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
                      ? "bg-stellar-purple/10 border-stellar-purple shadow-[0_4px_15px_rgba(217,115,78,0.15)]" 
                      : "bg-white/60 border-black/5 shadow-sm hover:bg-white hover:border-black/10 hover:shadow"
                  )}
                >
                  <Icon className={clsx("w-6 h-6 mb-2", isSelected ? "text-stellar-purple" : "text-stellar-ink/40")} />
                  <span className={clsx("font-semibold", isSelected ? "text-stellar-purple" : "text-stellar-ink")}>{preset.value} XLM</span>
                  <span className={clsx("text-[10px] uppercase tracking-wider mt-1 font-medium", isSelected ? "text-stellar-purple/70" : "text-stellar-ink/40")}>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-stellar-ink/40 font-semibold uppercase tracking-wider text-xs">Custom</span>
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
              className="w-full bg-white/60 border border-black/10 shadow-inner rounded-2xl py-4 pl-20 pr-16 text-right font-mono text-xl text-stellar-ink placeholder-stellar-ink/20 focus:outline-none focus:ring-2 focus:ring-stellar-purple/30 focus:border-stellar-purple transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-stellar-ink/60 font-bold">XLM</span>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || !senderPublicKey}
            className="w-full group relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg disabled:shadow-none disabled:opacity-50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-stellar-purple to-stellar-accent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-transparent px-6 py-4 flex items-center justify-center gap-3">
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="font-bold text-lg text-white">Send {customAmount || amount} XLM</span>
                </>
              )}
            </div>
          </button>
          
          {!senderPublicKey && (
            <p className="text-center text-xs text-stellar-purple mt-2 font-medium">
              Connect your wallet to send a tip
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
