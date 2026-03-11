
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Globe, 
  ChevronRight 
} from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("marketplace")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setItem(data);
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-stone-400 animate-pulse">
        Retrieving Details...
      </div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
      <h1 className="text-2xl font-bold mb-4">Product not found.</h1>
      <button onClick={() => router.push('/marketplace')} className="text-orange-700 font-bold uppercase text-xs tracking-widest">
        Return to Marketplace
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif pb-24">
      {/* --- TOP NAVIGATION --- */}
      <nav className="p-8 md:p-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <button 
          onClick={() => router.push('/marketplace')}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Back to Explore</span>
        </button>
        <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-stone-300">
          Marketplace <ChevronRight size={10} /> {item.category} <ChevronRight size={10} /> <span className="text-stone-900">{item.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* --- LEFT: IMAGE SECTION --- */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-[3rem] border border-stone-100 overflow-hidden shadow-sm group">
            {item.image_url?.startsWith('http') ? (
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-stone-50">
                {item.image_url || "📦"}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <div className="aspect-square bg-stone-100 rounded-2xl opacity-50 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-[10px] font-bold uppercase">No Alt View</div>
             <div className="aspect-square bg-stone-100 rounded-2xl opacity-50 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-[10px] font-bold uppercase">No Alt View</div>
             <div className="aspect-square bg-stone-100 rounded-2xl opacity-50 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-[10px] font-bold uppercase">No Alt View</div>
          </div>
        </div>

        {/* --- RIGHT: CONTENT SECTION --- */}
        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <span className="bg-orange-50 text-orange-700 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-100 mb-6 inline-block">
              {item.category}
            </span>
            <p className="text-stone-400 font-sans text-xs font-bold uppercase tracking-[0.3em] mb-2">{item.business}</p>
            <h1 className="text-6xl font-bold tracking-tighter leading-tight mb-4">{item.name}</h1>
            <div className="text-3xl font-sans font-light text-stone-900 mb-8">
               {item.price === "0" || !item.price ? "Free Resource" : `₱${item.price}`}
            </div>
            <p className="text-stone-500 text-lg leading-relaxed italic border-l-2 border-stone-100 pl-6">
              This is a premium {item.category.toLowerCase()} curated by {item.business}. 
              Crafted with precision to elevate your digital workspace.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-4 text-stone-400">
               <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                 <ShieldCheck size={18} />
               </div>
               <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Verified Creator</span>
            </div>
            <div className="flex items-center gap-4 text-stone-400">
               <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                 <Globe size={18} />
               </div>
               <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Digital License Included</span>
            </div>
          </div>

<div className="flex flex-col sm:flex-row gap-4">
  {/* Acquire / Buy Button */}
  <button className="flex-1 bg-stone-900 text-white py-6 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl flex items-center justify-center gap-3 group">
    <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
    Acquire Now
  </button>

  {/* UPDATED: Visit Store Button */}
  <button 
    onClick={() => {
      if (item.webpage_url) {
        // If the owner has an external URL (e.g., https://their-site.com)
        window.open(item.webpage_url, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to your internal marketplace subfolder if no URL is provided
        router.push(`/marketplace/${id}/webpage`);
      }
    }}
    className="px-8 bg-white border border-stone-200 text-stone-900 py-6 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all shadow-sm flex items-center gap-2"
  >
    <Globe size={14} />
    Visit Store
  </button>
</div>
        </div>
      </main>
    </div>
  );
}
