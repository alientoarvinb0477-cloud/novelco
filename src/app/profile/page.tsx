"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, ExternalLink, Package, BookOpen, Plus, Layout, Store, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"stories" | "marketplace">("stories");
  const [isCreating, setIsCreating] = useState(false);

  // 1. IMPROVED: Fetch function to be reusable for refreshing the list
  const fetchData = async () => {
    if (!user) return;

    // Fetch Stories
    const { data: storyData } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_draft", true);
    if (storyData) setDrafts(storyData);

    // Fetch Marketplace Stores
    const { data: marketData } = await supabase
      .from("marketplace")
      .select("*")
      .eq("user_id", user.id)
      .order('created_at', { ascending: false }); // Show newest first
    if (marketData) setMyProducts(marketData);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleCreateStore = async () => {
    if (!user) return;
    setIsCreating(true);

    const { data, error } = await supabase
      .from("marketplace")
      .insert([
        { 
          user_id: user.id, 
          name: "New Storefront", 
          business: user.fullName || "My Business",
          price: "0", 
          category: "Store",
          image_url: "📦", // Default emoji as per your schema
          config_draft: { content: [], root: {} },
          config_published: { content: [], root: {} } // Initialize published too
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Detailed Error:", error.message);
      setIsCreating(false);
    } else if (data) {
      router.push(`/marketplace/${data.id}/edit`);
    }
  };

  // 2. NEW: Function to delete a store
  const handleDeleteStore = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    
    const { error } = await supabase
      .from("marketplace")
      .delete()
      .eq("id", id);
    
    if (error) alert(error.message);
    else fetchData(); // Refresh the list
  };

  if (!isLoaded || !user) return <div className="p-20 text-center font-sans uppercase tracking-widest text-stone-400">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif p-12">
      <nav className="mb-20 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:text-orange-700 transition-colors">NovelCo.</Link>
        <div className="flex gap-4">
           <button 
            onClick={() => setActiveTab("stories")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "stories" ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-100"}`}
           >
             <BookOpen size={12} /> My Stories
           </button>
           <button 
            onClick={() => setActiveTab("marketplace")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "marketplace" ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-100"}`}
           >
             <Package size={12} /> Manage Stores
           </button>
        </div>
      </nav>

      <header className="mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold mb-2 tracking-tight">
            {activeTab === "stories" ? "Your Drafts" : "Your Stores"}
          </h1>
          <p className="text-stone-400 font-sans italic text-lg">
            {activeTab === "stories" ? "Unfinished worlds and quiet thoughts." : "Build your storefront using the visual editor."}
          </p>
        </div>

        {activeTab === "marketplace" && (
          <button 
            onClick={handleCreateStore}
            disabled={isCreating}
            className="flex items-center gap-2 bg-orange-700 text-white px-8 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-xl disabled:opacity-50"
          >
            <Store size={14} /> {isCreating ? "Initializing..." : "Create Store"}
          </button>
        )}
      </header>

      {activeTab === "stories" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stories List logic here */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {myProducts.length > 0 ? myProducts.map((product) => (
            <div key={product.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col group relative">
              {/* Delete Button (Hover effect) */}
              <button 
                onClick={() => handleDeleteStore(product.id)}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>

              <div className="aspect-video bg-stone-50 rounded-2xl flex items-center justify-center text-5xl mb-6 overflow-hidden relative">
                {product.image_url?.startsWith('http') ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{product.image_url || "🏪"}</span>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1 tracking-tight">{product.name}</h3>
                <p className="text-stone-400 font-sans text-[10px] font-bold uppercase tracking-[0.2em]">{product.business}</p>
              </div>
              
              <div className="flex flex-col gap-3 mt-auto">
                <Link 
                  href={`/marketplace/${product.id}/edit`}
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-2xl text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md"
                >
                  <Layout size={12} /> Customize Storefront
                </Link>
                <Link 
                  href={`/marketplace/${product.id}`}
                  target="_blank" // Opens live page in new tab
                  className="w-full flex items-center justify-center border border-stone-200 py-4 rounded-2xl text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all gap-2"
                >
                  <ExternalLink size={12} /> View Live Page
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 border-2 border-dashed border-stone-100 rounded-[3rem] text-center flex flex-col items-center">
              <p className="text-stone-300 font-sans text-xs uppercase tracking-[0.2em] mb-8">You haven't launched a store yet.</p>
              <button 
                onClick={handleCreateStore}
                className="flex items-center gap-2 bg-white border border-stone-200 px-8 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all shadow-sm"
              >
                <Plus size={14} /> Start Your Business
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
