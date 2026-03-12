"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import Link from "next/link";
import { 
  Search, 
  Package, 
  Store, 
  Wrench, 
  ArrowRight, 
  Filter 
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

    const { data, error } = await query;
    if (data) setItems(data);
    setLoading(false);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.business.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      {/* ─── NAVIGATION ─── */}
      <nav className="p-8 flex justify-between items-center border-b border-stone-100 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <Link href="/" className="text-xl font-bold tracking-tighter">NovelArc.Studio</Link>
        <div className="flex gap-8 font-sans text-[10px] font-bold uppercase tracking-widest">
          <Link href="/library" className="hover:text-orange-700 transition-colors">Library</Link>
          <Link href="/community" className="hover:text-orange-700 transition-colors">Community</Link>
          <Link href="/profile" className="text-orange-700">My Workspace</Link>
        </div>
      </nav>

      {/* ─── HERO & SEARCH ─── */}
      <header className="py-20 px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-7xl font-bold tracking-tighter mb-6">The Marketplace</h1>
        <p className="text-stone-400 italic text-xl mb-12">Discover stores, products, and professional services.</p>
        
        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-orange-700 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search businesses or products..."
            className="w-full bg-white border border-stone-100 py-6 px-16 rounded-3xl shadow-sm focus:shadow-xl focus:ring-2 focus:ring-orange-700/10 transition-all outline-none font-sans"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* ─── FILTERS ─── */}
      <section className="px-8 max-w-7xl mx-auto mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {["All", "Store", "Product", "Service"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-8 py-3 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === cat 
                ? "bg-stone-900 text-white shadow-lg" 
                : "bg-white text-stone-400 border border-stone-100 hover:border-stone-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── GRID ─── */}
      <main className="px-8 max-w-7xl mx-auto pb-24">
        {loading ? (
          <div className="text-center py-24 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">
            Scanning the marketplace...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filteredItems.map((item) => (
              <Link 
                key={item.id} 
                href={`/marketplace/${item.id}`}
                className="group bg-white rounded-[2.5rem] border border-stone-100 p-2 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] bg-stone-50 rounded-[2rem] overflow-hidden flex items-center justify-center relative">
                  {item.image_url?.startsWith('http') ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <span className="text-7xl group-hover:scale-125 transition-transform duration-500">
                      {item.image_url || "📦"}
                    </span>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                    {item.category === 'Store' && <Store size={10} className="text-orange-700" />}
                    {item.category === 'Product' && <Package size={10} className="text-orange-700" />}
                    {item.category === 'Service' && <Wrench size={10} className="text-orange-700" />}
                    <span className="font-sans text-[8px] font-bold uppercase tracking-widest">{item.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-stone-400 font-sans text-[9px] font-bold uppercase tracking-[0.3em] mb-2">
                    {item.business}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-orange-700 transition-colors">
                    {item.name}
                  </h3>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-stone-50">
                    <span className="font-sans font-bold text-lg tracking-tight">
                      {item.price === "0" ? "Free" : `₱${item.price}`}
                    </span>
                    <div className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-orange-700">
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-stone-100 rounded-[3rem]">
            <p className="text-stone-300 font-sans text-xs uppercase tracking-[0.2em]">No listings found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
