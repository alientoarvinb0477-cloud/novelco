"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import Link from "next/link";
import { 
  Search, 
  Package, 
  Store, 
  Wrench, 
  ArrowRight
} from "lucide-react";

export default function MainMarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Store" | "Product" | "Service">("All");

  useEffect(() => {
    fetchMarketplace();
  }, [filter]);

  const fetchMarketplace = async () => {
    setLoading(true);
    let query = supabase
      .from("marketplace")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "All") {
      query = query.eq("category", filter);
    }

    const { data } = await query;
    if (data) setItems(data);
    setLoading(false);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.business.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* ─── HERO & SEARCH ─── */}
      <header className="py-12 md:py-20 text-center">
        {/* Responsive Text: text-4xl on mobile, text-7xl on desktop */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-6">
          The Marketplace
        </h1>
        <p className="text-stone-400 italic text-base md:text-xl mb-8 md:mb-12 px-4">
          Discover stores, products, and professional services.
        </p>
        
        <div className="max-w-2xl mx-auto relative group px-2">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
          <input 
            type="text"
            placeholder="Search..."
            className="w-full bg-white border border-stone-100 py-4 md:py-6 px-14 md:px-16 rounded-2xl md:rounded-3xl shadow-sm focus:shadow-xl transition-all outline-none font-sans text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* ─── FILTERS ─── */}
      <section className="mb-12 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex justify-start md:justify-center gap-3 min-w-max px-2">
          {["All", "Store", "Product", "Service"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 md:px-8 py-3 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === cat 
                ? "bg-stone-900 text-white shadow-lg" 
                : "bg-white text-stone-400 border border-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── GRID ─── */}
      <main className="pb-24">
        {loading ? (
          <div className="text-center py-24 font-sans text-[10px] font-bold uppercase tracking-widest text-stone-300 animate-pulse">
            Scanning the marketplace...
          </div>
        ) : (
          /* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredItems.map((item) => (
              <Link 
                key={item.id} 
                href={`/marketplace/${item.id}`}
                className="group bg-white rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 p-2 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/5] bg-stone-50 rounded-[1.8rem] md:rounded-[2rem] overflow-hidden flex items-center justify-center relative">
                  {item.image_url?.startsWith('http') ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <span className="text-5xl md:text-7xl group-hover:scale-125 transition-transform duration-500">
                      {item.image_url || "📦"}
                    </span>
                  )}
                  
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 shadow-sm">
                    {item.category === 'Store' && <Store size={10} className="text-orange-700" />}
                    {item.category === 'Product' && <Package size={10} className="text-orange-700" />}
                    {item.category === 'Service' && <Wrench size={10} className="text-orange-700" />}
                    <span className="font-sans text-[8px] font-bold uppercase tracking-widest">{item.category}</span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-orange-700 font-sans text-[9px] font-bold uppercase tracking-[0.3em] mb-2">
                    {item.business}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-orange-700 transition-colors">
                    {item.name}
                  </h3>
                  
                  <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-stone-50">
                    <span className="font-sans font-bold text-base md:text-lg tracking-tight text-stone-900">
                      {item.price === "0" || !item.price ? "Free" : `₱${item.price}`}
                    </span>
                    <div className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-orange-700">
                      View <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
