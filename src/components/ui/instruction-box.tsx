"use client";

import { Info, Lightbulb, MousePointerClick, Video } from "lucide-react";

interface InstructionProps {
  type: "image" | "product" | "service" | "video";
}

export default function InstructionBox({ type }: InstructionProps) {
  const content = {
    image: {
      title: "How to add images",
      text: "Find an image online → Right-click → 'Copy Image Address' → Paste it in the URL field.",
      icon: <MousePointerClick size={18} />,
      color: "bg-orange-50/50 border-orange-100 text-orange-800",
    },
    product: {
      title: "Product Listing Tip",
      text: "Use high-quality URLs. Physical products look best with clean, minimal backgrounds.",
      icon: <Lightbulb size={18} />,
      color: "bg-stone-50 border-stone-100 text-stone-800",
    },
    service: {
      title: "Professional Service Tip",
      text: "Clearly state your starting price to manage client expectations early.",
      icon: <Info size={18} />,
      color: "bg-blue-50/50 border-blue-100 text-blue-800",
    },
    video: {
      title: "Video Integration",
      text: "Go to YouTube or Vimeo → Copy the link from the address bar → Paste it to show a demo.",
      icon: <Video size={18} />,
      color: "bg-red-50/50 border-red-100 text-red-800",
    }
  };

  const active = content[type];

  return (
    <div className={`mb-12 border p-6 rounded-[2rem] flex items-start gap-4 ${active.color}`}>
      <div className="opacity-70">{active.icon}</div>
      <div>
        <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest mb-1">
          {active.title}
        </h4>
        <p className="font-serif italic text-stone-500 text-sm leading-relaxed">
          {active.text}
        </p>
      </div>
    </div>
  );
}