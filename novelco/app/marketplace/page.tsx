"use client";

import { UserButton, Show } from '@clerk/nextjs';
import Link from 'next/link';

export default function Marketplace() {
  const products = [
    { id: 1, name: "Handcrafted Leather Journal", price: "$45", business: "STONE & INK CO.", img: "📔" },
    { id: 2, name: "Artisanal Ceramic Mug", price: "$32", business: "CLAY WORKS", img: "☕" },
    { id: 3, name: "Premium Fountain Pen", price: "$89", business: "THE WRITE TOOL", img: "🖋️" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      {/* Navigation - Matching your design */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter">NovelCo.</div>
        <div className="hidden md:flex space-x-8 text-xs font-bold font-sans uppercase tracking-widest text-stone-400">
          <Link href="/" className="hover:text-orange-700">Feed</Link>
          <Link href="/community" className="hover:text-orange-700">Community</Link>
          <Link href="/marketplace" className="text-stone-900 border-b-2 border-stone-900 pb-1">Marketplace</Link>
        </div>
        <UserButton />
      </nav>

      <main className="max-w-6xl mx-auto pt-20 pb-20 px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-8xl mb-6 leading-tight">
              The Curated <br />
              <span className="italic text-stone-400 font-light text-7xl md:text-9xl">Marketplace.</span>
            </h1>
            <p className="text-xl text-stone-500 font-sans leading-relaxed">
              A space for local businesses to showcase their craft to a community that values quality.
            </p>
          </div>
          
          <Link href="/marketplace/post">
            <button className="bg-[#D3450E] text-white px-8 py-4 rounded-xl font-sans font-bold hover:bg-orange-800 transition-all shadow-lg flex items-center gap-2">
              <span>+</span> List Your Product
            </button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-square bg-stone-100 rounded-[2.5rem] flex items-center justify-center text-7xl group-hover:bg-stone-200 transition-all duration-500 border border-stone-200 mb-6 shadow-sm">
                {product.img}
              </div>
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-orange-700 transition-colors">{product.name}</h3>
                  <p className="text-stone-400 font-sans text-[10px] font-bold tracking-[0.2em] uppercase">{product.business}</p>
                </div>
                <span className="font-serif italic text-2xl text-[#D3450E]">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}