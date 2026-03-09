"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ storeId, storeName }: { storeId: string; storeName: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/marketplace/${storeId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          text: `Check out ${storeName} on NovelCo!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="p-3 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-stone-50 transition-all flex items-center gap-1"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} className="text-stone-600" />}
      {copied && <span className="text-[8px] font-bold text-green-600 uppercase">Saved</span>}
    </button>
  );
}