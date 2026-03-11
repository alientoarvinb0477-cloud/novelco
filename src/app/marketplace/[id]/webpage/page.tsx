"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Globe, Package, Store, Wrench, ArrowLeft } from "lucide-react";

export default function UserWebpage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!id) return;
      
      const { data: item, error } = await supabase
        .from("marketplace")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching page:", error);
      } else {
        setData(item);
      }
      setLoading(false);
    };

    fetchPageData();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-sans uppercase tracking-widest text-stone-400">Loading Experience...</div>;
  if (!data) return <div className="p-20 text-center font-serif text-2xl">Page not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      {/* Simple Nav */}
      <nav className="p-8 flex justify-between items-center">
        <Link href="/marketplace" className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-orange-700 transition-colors">
          <ArrowLeft size={14} /> Back to Market
        </Link>
        <div className="text-xl font-bold tracking-tighter">NovelArchStudio</div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Visual Side */}
          <div className="aspect-[4/5] bg-stone-100 rounded-[3rem] overflow-hidden flex items-center justify-center border border-stone-100 shadow-2xl">
            {data.image_url?.startsWith('http') ? (
              <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-9xl">{data.image_url || "📦"}</span>
            )}
          </div>

          {/* Info Side */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-orange-700 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                {data.category}
              </span>
              <span className="text-stone-400 font-sans text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} /> Verified Member
              </span>
            </div>

            <h1 className="text-6xl font-bold tracking-tighter mb-4">{data.name}</h1>
            <p className="text-stone-400 text-xl italic mb-8">by {data.business}</p>
            
            <div className="prose prose-stone mb-12">
              <p className="text-lg leading-relaxed text-stone-600">
                {data.description || "No description provided for this listing."}
              </p>
            </div>

            <div className="flex items-center justify-between p-8 bg-white border border-stone-100 rounded-[2rem] shadow-sm">
              <div>
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 mb-1">Pricing</p>
                <p className="text-3xl font-bold">₱{data.price || "0"}</p>
              </div>
              <button className="bg-stone-900 text-white px-10 py-5 rounded-2xl font-sans font-bold uppercase text-xs tracking-widest hover:bg-orange-700 transition-all shadow-lg">
                Contact Business
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
