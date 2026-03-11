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
  Layout, 
  Store, 
  Trash2, 
  Wrench, 
  Link as LinkIcon,
  ShieldCheck,
  Heart,
  Coffee,
  Sparkles
} from "lucide-react";
import InstructionBox from "@/components/ui/instruction-box"; 

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"stories" | "marketplace" | "hero">("hero");

  // Mock Hero Stats - In a production app, these would be fetched from Supabase
  const [heroStats] = useState({
    name: "Architect Prime",
    health: 85,
    hunger: 40,
    level: 1
  });

  const hasExistingStore = myProducts.some(item => item.category === 'Store');

  const fetchData = async () => {
    if (!user) return;
    const { data: marketData } = await supabase
      .from("marketplace")
      .select("*")
      .eq("user_id", user.id)
      .order('created_at', { ascending: false });
    if (marketData) setMyProducts(marketData);
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const handleUpdateImageUrl = async (itemId: string) => {
    const newUrl = window.prompt("IMAGE URL UPLOAD:\n1. Copy Image Address\n2. Paste here:");
    if (newUrl && newUrl.trim().startsWith('http')) {
      await supabase.from("marketplace").update({ image_url: newUrl.trim() }).eq('id', itemId);
      fetchData();
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from("marketplace").delete().eq("id", id);
    if (!error) fetchData();
  };

  if (!isLoaded || !user) return <div className="p-20 text-center font-sans uppercase tracking-widest text-stone-400">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif p-12">
      <nav className="mb-20 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:text-orange-700">NovelArchStudio</Link>
        <div className="flex gap-4">
           <button onClick={() => setActiveTab("hero")} className={`px-6 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "hero" ? "bg-orange-700 text-white" : "bg-white text-stone-400 border border-stone-100"}`}>
             <Sparkles size={12} className="inline mr-2"/> MyArcHero
           </button>
           <button onClick={() => setActiveTab("stories")} className={`px-6 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "stories" ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-100"}`}>
             <BookOpen size={12} className="inline mr-2"/> Stories
           </button>
           <button onClick={() => setActiveTab("marketplace")} className={`px-6 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "marketplace" ? "bg-stone-900 text-white" : "bg-white text-stone-400 border border-stone-100"}`}>
             <Package size={12} className="inline mr-2"/> Marketplace
           </button>
        </div>
      </nav>

      {/* --- MY ARCHERO VIEW --- */}
      {activeTab === "hero" && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] border border-stone-100 p-12 shadow-xl flex flex-col md:flex-row gap-12 items-center">
            <div className="w-64 h-64 bg-stone-50 rounded-[2rem] flex items-center justify-center relative border-2 border-dashed border-stone-200 group overflow-hidden">
               <div className="text-stone-200 group-hover:scale-110 transition-transform">
                 <Sparkles size={80} />
               </div>
               <div className="absolute bottom-4 bg-orange-700 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                 Lv. {heroStats.level}
               </div>
            </div>

            <div className="flex-1 w-full">
              <h1 className="text-5xl font-bold tracking-tight mb-2">MyArcHero</h1>
              <p className="text-stone-400 italic mb-8">The guardian of your ArcWorld characters.</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-stone-50 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                      <Heart size={12} className="text-red-500"/> Health
                    </span>
                    <span className="font-sans font-bold text-sm">{heroStats.health}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${heroStats.health}%` }} />
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                      <Coffee size={12} className="text-orange-700"/> Hunger
                    </span>
                    <span className="font-sans font-bold text-sm">{heroStats.hunger}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-700 transition-all duration-500" style={{ width: `${heroStats.hunger}%` }} />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/arc-world')}
                className="w-full bg-stone-900 text-white py-5 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <Sparkles size={16} /> Enter ArcWorld to Sustain Hero
              </button>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-stone-400 text-sm italic">Sustain your hero in the 3D world to save more characters.</p>
          </div>
        </div>
      )}

      {/* --- STORIES & MARKETPLACE VIEWS --- */}
      {activeTab === "marketplace" && <InstructionBox type="image" />}

      {activeTab !== "hero" && (
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-2 tracking-tight">{activeTab === "stories" ? "Your Drafts" : "Your Marketplace"}</h1>
            <p className="text-stone-400 font-sans italic text-lg">{activeTab === "stories" ? "Your creative works in progress." : "Manage your storefront and professional offerings."}</p>
          </div>

          {activeTab === "marketplace" && (
            <div className="flex flex-wrap gap-3">
              <Link href="/marketplace/services/create" className="bg-stone-100 text-stone-600 px-6 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all flex items-center gap-2">
                <Wrench size={14} /> Post Service
              </Link>
              <Link href="/marketplace/products/create" className="bg-stone-100 text-stone-600 px-6 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all flex items-center gap-2">
                <Package size={14} /> Share Product
              </Link>
              
              {!hasExistingStore ? (
                <Link href="/marketplace/create" className="bg-orange-700 text-white px-8 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-xl flex items-center gap-2">
                  <Store size={14} /> Create Store
                </Link>
              ) : (
                <div className="bg-stone-100 text-stone-300 px-8 py-4 rounded-2xl font-sans text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-not-allowed">
                  <ShieldCheck size={14} /> Manage Store
                </div>
              )}
            </div>
          )}
        </header>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activeTab === "marketplace" && myProducts.map((item) => (
          <div key={item.id} className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col group relative ${item.category === 'Store' ? 'bg-orange-50/30 border-orange-100 ring-2 ring-orange-200' : 'bg-white border-stone-100'}`}>
            <button onClick={() => handleDeleteItem(item.id)} className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 z-10">
              <Trash2 size={16} />
            </button>

            <div className="aspect-video bg-stone-50 rounded-2xl flex items-center justify-center text-5xl mb-6 overflow-hidden relative group/img">
              {item.image_url?.startsWith('http') ? (
                <img src={item.image_url} className="w-full h-full object-cover" />
              ) : <span>{item.image_url || "📦"}</span>}
              <button onClick={() => handleUpdateImageUrl(item.id)} className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase">
                <LinkIcon size={20} className="mb-2" /> Update Image
              </button>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold tracking-tight">{item.name}</h3>
                <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded tracking-widest ${item.category === 'Store' ? 'bg-orange-700 text-white' : 'bg-stone-100 text-stone-500'}`}>{item.category}</span>
              </div>
              <p className="text-stone-400 font-sans text-[10px] font-bold uppercase tracking-[0.2em]">{item.business}</p>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <Link 
                href={item.category === 'Service' ? `/marketplace/services/${item.id}/edit` : item.category === 'Store' ? `/marketplace/edit/${item.id}` : `/marketplace/products/${item.id}/edit`} 
                className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-2xl text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-orange-700 transition-all"
              >
                <Layout size={12} /> Edit {item.category === 'Store' ? 'Store Design' : 'Configuration'}
              </Link>
              <Link href={`/marketplace/${item.id}`} target="_blank" className="w-full flex items-center justify-center border border-stone-200 py-4 rounded-2xl text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all gap-2">
                <ExternalLink size={12} /> Visit Store
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
