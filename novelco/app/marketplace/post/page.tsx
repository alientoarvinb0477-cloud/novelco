"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    businessName: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll log the data. We'll connect this to Supabase/Prisma next!
    console.log("New Product Listing:", formData);
    alert("Listing Created! Redirecting to Marketplace...");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif p-8">
      <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-3xl p-12 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">List a Product</h1>
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors font-sans text-sm uppercase tracking-widest">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 font-sans">
          {/* Business Info */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Business Name</label>
            <input 
              required
              type="text"
              placeholder="e.g. Stone & Ink Co."
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-orange-700 transition-colors"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Product Name</label>
              <input 
                required
                type="text"
                placeholder="Handcrafted Journal"
                className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-orange-700 transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Price ($)</label>
              <input 
                required
                type="number"
                placeholder="45"
                className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-orange-700 transition-colors"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Description</label>
            <textarea 
              rows={4}
              placeholder="Tell the community about your craft..."
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-orange-700 transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg active:scale-95"
          >
            Publish to Marketplace
          </button>
        </form>
      </div>
    </div>
  );
}