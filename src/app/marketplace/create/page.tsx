"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ExternalLink, 
  Layout, 
  Trash2, 
  UploadCloud, 
  Plus, 
  Sparkles, 
  MousePointer2, 
  Globe,
  Lock
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const { data: marketData } = await supabase
      .from("marketplace")
      .select("*")
      .eq("user_id", user.id)
      .order('created_at', { ascending: false });
    if (marketData) setMyProducts(marketData);
  };

  useEffect(() => {
    if (isSignedIn && user) fetchData();
  }, [isSignedIn, user]);

  // Handle single specialized creation
  const handleCreateWebsite = async () => {
    if (!user) return;
    setIsCreating(true);

    const { data, error } = await supabase
      .from("marketplace")
      .insert([
        { 
          user_id: user.id, 
          name: "My New Website", 
          business: user.fullName || "Creative Studio",
          price: "0", 
          category: "Store",
          image_url: "🌐",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${itemId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('marketplace').upload(fileName, file);
    if (uploadError) return alert("Upload failed: " + uploadError.message);

    const { data: { publicUrl } } = supabase.storage.from('marketplace').getPublicUrl(fileName);
    await supabase.from("marketplace").update({ image_url: publicUrl }).eq('id', itemId);
    fetchData(); 
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete your page.")) return;
    const { error } = await supabase.from("marketplace").delete().eq("id", id);
    if (!error) fetchData();
  };

  // --- SIGN IN GUARD ---
  if (!isLoaded) return <div className="p-20 text-center font-sans uppercase tracking-widest text-stone-400">Loading Profile...</div>;

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] p-8">
        <div className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-xl text-center max-w-md">
          <Lock size={40} className="mx-auto mb-6 text-stone-200" />
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Need to Sign In First</h1>
          <p className="text-stone-400 mb-10 italic">Please sign in to access your digital workspace and manage your pages.</p>
          <button onClick={() => router.push('/sign-in')} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg">
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif p-8 md:p-12">
      <nav className="mb-20 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:text-orange-700 transition-colors">NovelCo.</Link>
        <button 
          onClick={handleCreateWebsite}
          disabled={isCreating}
          className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl disabled:opacity-50"
        >
          <Plus size={14} /> {isCreating ? "Initializing..." : "Launch Digital Canvas"}
        </button>
      </nav>

      <div className="max-w-6xl mx-auto">
        {/* --- INSTRUCTION GUIDE --- */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-orange-50/50 border border-orange-100">
            <Sparkles className="text-orange-700 mb-4" size={24} />
            <h4 className="font-bold text-lg mb-2">1. Create</h4>
            <p className="text-stone-500 text-sm leading-relaxed font-sans">Click the 'Launch' button above to start a fresh project.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
            <MousePointer2 className="text-stone-900 mb-4" size={24} />
            <h4 className="font-bold text-lg mb-2">2. Design</h4>
            <p className="text-stone-500 text-sm leading-relaxed font-sans">Use 'Customize Page' to open the visual builder and add content.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
            <Globe className="text-stone-900 mb-4" size={24} />
            <h4 className="font-bold text-lg mb-2">3. Go Live</h4>
            <p className="text-stone-500 text-sm leading-relaxed font-sans">View your live URL and share your creation with the world.</p>
          </div>
        </section>

        <header className="mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Your Workspace</h2>
          <p className="text-stone-400 italic font-sans">Manage your active digital presences.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {myProducts.map((item) => (
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
                  <span className="opacity-20 select-none">🌐</span>
                )}
                
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase cursor-pointer">
                  <UploadCloud size={24} className="mb-2" />
                  Edit Thumbnail
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, item.id)} 
                  />
                </label>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold tracking-tight mb-1">{item.name}</h3>
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

          {myProducts.length === 0 && (
            <div className="col-span-full py-20 border-2 border-dashed border-stone-100 rounded-[3rem] text-center">
              <p className="text-stone-300 italic font-serif text-xl">Your workspace is quiet. Start by launching a new canvas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
