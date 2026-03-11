"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from "@lib/supabase";
import { useRouter } from "next/navigation"; 
import { Search, Store, Package, Wrench, ArrowLeft, Globe } from "lucide-react";
import InstructionBox from "@/components/ui/instruction-box";

export default function MarketplaceExplore() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchMarketplace = async () => {
      const { data } = await supabase
        .from("marketplace")
        .select("*")
        .order('created_at', { ascending: false });

      if (data) {
        setItems(data);
      }
      setLoading(false);
    };
    fetchMarketplace();
  }, []);

  // UPDATED: Routes to your NEW product-details folder
  const handleCardClick = (itemId: string) => {
    router.push(`/marketplace/${itemId}/product-details`);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.business?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <div className="p-24 text-center font-sans text-[10px] uppercase tracking-widest text-stone-400 animate-pulse">
        Loading Explore...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif p-8 md:p-12 relative">
      
      {/* --- NAVIGATION --- */}
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Back to Home</span>
        </button>
        
        <button 
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-all shadow-lg"
        >
          <Globe size={14} /> My Workspace
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Explore</h1>
          <p className="text-stone-400 text-xl italic mb-8">Click an item to view full product details.</p>
          
          <InstructionBox type="product" />
          
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                className="w-full bg-white border border-stone-100 p-5 pl-12 rounded-2xl outline-none shadow-sm font-sans"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* --- MARKETPLACE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleCardClick(item.id)}
              className="bg-white rounded-[2.5rem] border border-stone-100 p-8 flex flex-col group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* IMAGE CONTAINER */}
              <div className="aspect-video bg-stone-50 rounded-2xl mb-6 overflow-hidden relative border border-stone-50">
                {item.image_url?.startsWith('http') ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-stone-200">
                    {item.category === 'Service' ? <Wrench /> : item.category === 'Store' ? <Store /> : <Package />}
                  </div>
                )}
                
                {/* Overlay that appears on hover to signal clickability */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                   <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full font-sans text-[8px] font-bold uppercase tracking-widest shadow-sm transition-opacity">
                     View Details
                   </span>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-orange-700 font-sans text-[10px] font-bold uppercase tracking-widest mb-2">{item.business}</p>
                <h3 className="text-2xl font-bold tracking-tight group-hover:text-orange-700 transition-colors">{item.name}</h3>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-50">
                  <div className="text-stone-900 font-sans font-bold text-lg">
                    {item.price === "0" || !item.price ? "Free" : `₱${item.price}`}
                  </div>
                  <div className="text-orange-700 font-sans text-[9px] font-bold uppercase tracking-widest">
                    Details →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
