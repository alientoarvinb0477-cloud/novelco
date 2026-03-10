"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Wrench, Save, ArrowLeft, Video } from "lucide-react";
import Link from "next/link";
import InstructionBox from "@/components/ui/instruction-box";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const fetchService = async () => {
      const { data } = await supabase.from("marketplace").select("*").eq("id", id).single();
      if (data) setService(data);
      setLoading(false);
    };
    fetchService();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("marketplace").update(service).eq("id", id);
    if (!error) router.push("/profile");
    else alert("Error updating service: " + error.message);
  };

  if (loading) return <div className="p-24 text-center font-sans text-[10px] uppercase tracking-widest text-stone-400">Loading Service Editor...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-12 font-serif">
      <Link href="/profile" className="flex items-center gap-2 text-stone-400 mb-12 font-sans text-[10px] uppercase tracking-widest">
        <ArrowLeft size={14} /> Back to Workspace
      </Link>

      <div className="max-w-2xl mx-auto">
        {/* Instruction integrated here */}
        <InstructionBox type="video" />

        <div className="bg-white p-16 rounded-[3rem] border border-stone-100 shadow-sm font-sans">
          <header className="mb-12 border-b border-stone-50 pb-8">
            <div className="text-blue-700 mb-4 bg-blue-50 w-fit p-4 rounded-2xl">
              <Wrench size={32} />
            </div>
            <h1 className="text-4xl font-serif font-bold tracking-tight">Service Configuration</h1>
            <p className="text-stone-400 italic">Define your professional offering.</p>
          </header>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Professional / Brand Name</label>
              <input 
                className="w-full bg-stone-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700"
                value={service.business || ""}
                onChange={(e) => setService({...service, business: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Service Title</label>
              <input 
                className="w-full bg-stone-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 text-xl font-medium"
                value={service.name || ""}
                onChange={(e) => setService({...service, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Pricing Model</label>
              <div className="flex gap-4">
                 <input 
                  className="flex-1 bg-stone-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700"
                  value={service.price || ""}
                  onChange={(e) => setService({...service, price: e.target.value})}
                />
                <div className="bg-stone-50 px-6 flex items-center rounded-2xl text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">Starting Price</div>
              </div>
            </div>

            {/* NEW: Demo Video URL Field */}
            <div className="space-y-2 pt-4 border-t border-stone-50">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-400 tracking-widest">
                <Video size={12} className="text-red-600" /> Demo Video URL (YouTube/Vimeo)
              </label>
              <input 
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-stone-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-red-700"
                value={service.video_url || ""}
                onChange={(e) => setService({...service, video_url: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-stone-900 text-white py-6 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-2xl">
              <Save size={16} /> Save Professional Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}