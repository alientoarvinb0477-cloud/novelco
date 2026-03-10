"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Package, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("marketplace").select("*").eq("id", id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("marketplace").update(product).eq("id", id);
    if (!error) router.push("/profile");
  };

  if (loading) return <div className="p-24 text-center font-sans text-[10px] uppercase tracking-widest text-stone-400">Loading Product Editor...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-12 font-serif">
      <Link href="/profile" className="flex items-center gap-2 text-stone-400 mb-12 font-sans text-[10px] uppercase tracking-widest">
        <ArrowLeft size={14} /> Back to Workspace
      </Link>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="aspect-square bg-white border border-stone-100 rounded-[3rem] flex items-center justify-center text-7xl shadow-sm overflow-hidden">
             {product.image_url?.startsWith('http') ? (
                <img src={product.image_url} className="w-full h-full object-cover" />
             ) : <span>{product.image_url}</span>}
          </div>
          <p className="text-center text-stone-400 font-sans text-[10px] uppercase tracking-widest">Manage images in the Profile view</p>
        </section>

        <form onSubmit={handleUpdate} className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm space-y-6 font-sans">
          <header className="mb-8">
            <div className="text-orange-700 mb-2"><Package size={24} /></div>
            <h1 className="text-3xl font-serif font-bold">Product Details</h1>
          </header>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Product Name</label>
            <input 
              className="w-full bg-stone-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-700"
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Price (PHP)</label>
              <input 
                className="w-full bg-stone-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-700"
                value={product.price}
                onChange={(e) => setProduct({...product, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Stock Status</label>
              <select className="w-full bg-stone-50 p-4 rounded-xl outline-none appearance-none">
                <option>In Stock</option>
                <option>Pre-Order</option>
                <option>Sold Out</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-xl">
            <Save size={14} /> Update Product
          </button>
        </form>
      </div>
    </div>
  );
}