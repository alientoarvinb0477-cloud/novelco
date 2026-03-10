"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ExternalLink, 
  Package, 
  BookOpen, 
  Plus, 
  Layout, 
  Store, 
  Trash2, 
  Wrench, 
  UploadCloud 
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"stories" | "marketplace">("stories");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all user-related data
  const fetchData = async () => {
    if (!user) return;

    // Fetch Stories
    const { data: storyData } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_draft", true);
    if (storyData) setDrafts(storyData);

    // Fetch Marketplace Items (Stores, Products, Services)
    const { data: marketData } = await supabase
      .from("marketplace")
      .select("*")
      .eq("user_id", user.id)
      .order('created_at', { ascending: false });
    if (marketData) setMyProducts(marketData);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Handle creation of different marketplace categories
  const handleCreateItem = async (type: "Store" | "Product" | "Service") => {
    if (!user) return;
    setIsCreating(true);

    const defaultIcons = {
      Store: "🏪",
      Product: "📦",
      Service: "🛠️"
    };

    const { data, error } = await supabase
      .from("marketplace")
      .insert([
        { 
          user_id: user.id, 
          name: `New ${type}`, 
          business: user.fullName || "My Business",
          price: "0", 
          category: type,
          image_url: defaultIcons[type],
          config_draft: { content: [], root: {} },
          config_published: { content: [], root: {} }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Creation Error:", error.message);
      setIsCreating(false);
    } else if (data) {
      router.push(`/marketplace/${data.id}/edit`);
    }
  };

  // Upload image to Supabase Storage and update the record
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${itemId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('marketplace')
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('marketplace')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("marketplace")
      .update({ image_url: publicUrl })
      .eq('id', itemId);

    if (updateError) alert(updateError.message);
    else fetchData(); 
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const { error } = await supabase
      .from("marketplace")
      .delete()
      .eq("id", id);
    
    if (error) alert(error.message);
    else fetchData();
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
             <Package size={12} /> My Marketplace
           </button>
        </div>
      </nav>

      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bold mb-2 tracking-tight">
            {activeTab === "stories" ? "Your Drafts" : "Your Marketplace"}
          </h1>
          <p className="text-stone-400 font-sans italic text-lg">
            {activeTab === "stories" ? "Unfinished worlds and quiet thoughts." : "Manage your professional presence and storefronts."}
          </p>
        </div>

        {activeTab === "marketplace" && (
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleCreateItem("Service")}
              className="flex items-center gap-2 bg-stone-100 text-stone-600 px-6 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
            >
              <Wrench size={14} /> Post Service
            </button>
            <button 
              onClick={() => handleCreateItem("Product")}
              className="flex items-center gap-2 bg-stone-100 text-stone-600 px-6 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
            >
              <Package size={14} /> Share Product
            </button>
            <button 
              onClick={() => handleCreateItem("Store")}
              disabled={isCreating}
              className="flex items-center gap-2 bg-orange-700 text-white px-8 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-xl disabled:opacity-50"
            >
              <Store size={14} /> {isCreating ? "Initializing..." : "Create Store"}
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activeTab === "marketplace" && myProducts.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col group relative">
            <button 
              onClick={() => handleDeleteItem(item.id)}
              className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
              <Trash2 size={16} />
            </button>

            <div className="aspect-video bg-stone-50 rounded-2xl flex items-center justify-center text-5xl mb-6 overflow-hidden relative group/img">
              {item.image_url?.startsWith('http') ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span>{item.image_url || "📦"}</span>
              )}
              
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase cursor-pointer">
                <UploadCloud size={24} className="mb-2" />
                Upload Image
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, item.id)} 
                />
              </label>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-2xl font-bold tracking-tight">{item.name}</h3>
                <span className="text-[8px] font-bold uppercase px-2 py-1 bg-stone-100 text-stone-500 rounded tracking-widest">
                  {item.category}
                </span>
              </div>
              <p className="text-stone-400 font-sans text-[10px] font-bold uppercase tracking-[0.2em]">{item.business}</p>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <Link 
                href={`/marketplace/${item.id}/edit`}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-2xl text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md"
              >
                <Layout size={12} /> Customize Page
              </Link>
              <Link 
                href={`/marketplace/${item.id}`}
                target="_blank"
                className="w-full flex items-center justify-center border border-stone-200 py-4 rounded-2xl text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all gap-2"
              >
                <ExternalLink size={12} /> View Live Page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}