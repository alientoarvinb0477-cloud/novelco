"use client";

import { useState, useEffect } from "react";
import { UserButton } from '@clerk/nextjs';
import { supabase } from "@lib/supabase";
import { useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { Edit3, ExternalLink, Search } from "lucide-react"; 
import ShareButton from "@/components/ShareButton";

export default function Marketplace() {
  const { user } = useUser();
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // State for search
  const [loading, setLoading] = useState(true);

  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [productReviews, setProductReviews] = useState<any[]>([]);

  // Updated Category List
  const categories = [
    { name: "All", icon: "✨" },
    { name: "Products", icon: "📦" },
    { name: "Services", icon: "🛠️" },
    { name: "Store", icon: "🏪" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('marketplace').select('*');
      
      if (activeCategory !== "All") {
        query = query.eq('category', activeCategory);
      }

      // Filter by search query if text exists
      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, searchQuery]); // Re-fetch on category or search change

  const fetchReviews = async (productId: string) => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (data) setProductReviews(data);
    setCommentingOn(productId);
  };

  const handleLike = async (productId: string, currentLikes: number) => {
    if (!user) return alert("Please sign in to react!");
    setProducts(products.map(p => 
      p.id === productId ? { ...p, likes_count: (currentLikes || 0) + 1 } : p
    ));
    await supabase.from('marketplace').update({ likes_count: (currentLikes || 0) + 1 }).eq('id', productId);
  };

  const submitReview = async (productId: string) => {
    if (!user || !newComment.trim()) return;
    const { error } = await supabase.from('reviews').insert([{
      product_id: productId,
      user_id: user.id,
      user_name: user.fullName || "Anonymous",
      comment: newComment,
      rating: 5 
    }]);
    if (!error) {
      setNewComment("");
      fetchReviews(productId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter">NovelCo.</div>
        <div className="hidden md:flex space-x-8 text-xs font-bold font-sans uppercase tracking-widest text-stone-400">
          <Link href="/" className="hover:text-orange-700">Feed</Link>
          <Link href="/community" className="hover:text-orange-700">Community</Link>
          <Link href="/marketplace" className="text-stone-900 border-b-2 border-stone-900 pb-1">Marketplace</Link>
        </div>
        <UserButton />
      </nav>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12 pt-12 px-8 pb-20">
        {/* SIDEBAR: Simplified Category Selection */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h2 className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-stone-300 mb-8">Categories</h2>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <button 
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 font-sans text-sm font-bold
                      ${activeCategory === cat.name ? "bg-stone-900 text-white shadow-lg" : "text-stone-400 hover:bg-stone-100 hover:text-stone-900"}`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-12 p-6 bg-orange-50 rounded-3xl border border-orange-100">
              <Link href="/marketplace/post" className="text-xs font-bold text-orange-800 uppercase tracking-tighter underline">
                + List Item →
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-grow">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <h1 className="text-5xl md:text-7xl leading-tight tracking-tighter">
              Discover <span className="italic font-light text-stone-400">Novelty.</span>
            </h1>
            
            {/* SEARCH BAR */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-orange-700 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-100 py-4 pl-12 pr-4 rounded-2xl font-sans text-sm outline-none focus:ring-2 focus:ring-orange-700/10 focus:border-orange-700 transition-all shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse text-stone-300 text-sm font-sans uppercase tracking-widest">Searching the archive...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="group bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm transition-all hover:shadow-xl relative flex flex-col">
                    
                    <div className="absolute top-10 right-10 z-10 flex gap-2">
                      <ShareButton storeId={product.id} storeName={product.name} />
                      <button 
                        onClick={() => handleLike(product.id, product.likes_count)}
                        className="p-3 bg-white/90 backdrop-blur rounded-full shadow-md hover:scale-110 transition-transform flex items-center gap-1"
                      >
                        ❤️ <span className="text-[10px] font-bold font-sans">{product.likes_count || 0}</span>
                      </button>
                    </div>

                    <div className="aspect-square bg-stone-50 rounded-3xl flex items-center justify-center text-7xl mb-6 overflow-hidden border border-stone-50">
                      {product.image_url?.startsWith('http') ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span>{product.image_url || "📦"}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
                        <p className="text-stone-400 font-sans text-[10px] font-bold uppercase tracking-widest">{product.business}</p>
                      </div>
                      <span className="font-serif italic text-2xl text-[#D3450E]">{product.price}</span>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <Link 
                        href={`/marketplace/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 border border-stone-200 py-3 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                      >
                        <ExternalLink size={12} /> View Page
                      </Link>
                      
                      {user?.id === product.user_id && (
                        <Link 
                          href={`/marketplace/${product.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-800 py-3 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-orange-100 transition-all"
                        >
                          <Edit3 size={12} /> Design Store
                        </Link>
                      )}
                    </div>

                    {/* REVIEWS & COMMENTS SECTION */}
                    <div className="mt-auto pt-6 border-t border-stone-50">
                      <button 
                        onClick={() => fetchReviews(product.id)}
                        className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 mb-4 flex items-center gap-2"
                      >
                        <span>💬</span> {commentingOn === product.id ? "Hide Comments" : "View Comments"}
                      </button>

                      {commentingOn === product.id && (
                        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {productReviews.length > 0 ? (
                            productReviews.map((rev) => (
                              <div key={rev.id} className="bg-stone-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold uppercase text-orange-700 mb-1">{rev.user_name}</p>
                                <p className="text-sm font-sans text-stone-600 leading-snug">{rev.comment}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs italic text-stone-300">No reviews yet.</p>
                          )}
                        </div>
                      )}

                      <input 
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full text-sm font-sans bg-stone-50 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-orange-700 transition-all"
                        value={commentingOn === product.id ? newComment : ""}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitReview(product.id)}
                      />
                    </div>

                    <a 
                      href={product.contact_info?.includes('@') ? `mailto:${product.contact_info}` : product.contact_info}
                      target="_blank"
                      className="mt-6 block text-center bg-stone-900 text-white py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all"
                    >
                      Message Seller
                    </a>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
                  <p className="text-stone-300 font-sans uppercase tracking-[0.2em] text-xs">No items found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
