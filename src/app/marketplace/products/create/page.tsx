"use client";

import { useState } from "react";
import { supabase } from "@lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Package, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    price: "",
    description: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("marketplace")
      .insert([{
        ...formData,
        user_id: user.id,
        category: "Product",
        image_url: "📦",
        config_draft: { content: [], root: {} },
        config_published: { content: [], root: {} }
      }])
      .select().single();

    if (data) router.push(`/marketplace/products/${data.id}/edit`);
    else setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-12 font-serif">
      <Link href="/profile" className="flex items-center gap-2 text-stone-400 mb-8 font-sans text-[10px] uppercase tracking-widest">
        <ArrowLeft size={14} /> Back to Profile
      </Link>
      
      <div className="max-w-xl mx-auto bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-700"><Package size={32} /></div>
          <h1 className="text-4xl font-bold tracking-tight">New Product</h1>
        </div>

        <form onSubmit={handleCreate} className="space-y-6 font-sans">
          <input 
            required
            placeholder="Product Name"
            className="w-full bg-stone-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-700"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            required
            placeholder="Brand/Business Name"
            className="w-full bg-stone-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-700"
            onChange={(e) => setFormData({...formData, business: e.target.value})}
          />
          <input 
            required
            placeholder="Price (PHP)"
            className="w-full bg-stone-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-700"
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
          <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all shadow-lg">
            {loading ? "Initializing..." : "Create Product Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}