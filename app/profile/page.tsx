"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchDrafts = async () => {
        const { data } = await supabase
          .from("stories")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_draft", true);
        if (data) setDrafts(data);
      };
      fetchDrafts();
    }
  }, [user]);

  if (!isLoaded || !user) return <div className="p-20 text-center font-sans uppercase tracking-widest text-stone-400">Loading Author Profile...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif p-12">
      <nav className="mb-20">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:text-orange-700 transition-colors">NovelCo.</Link>
      </nav>

      <header className="mb-16">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">Your Drafts</h1>
        <p className="text-stone-400 font-sans italic text-lg">Unfinished worlds and quiet thoughts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {drafts.length > 0 ? drafts.map((draft) => (
          <div key={draft.id} className="p-8 border border-stone-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all group">
            <h2 className="text-2xl font-bold mb-4 group-hover:text-orange-800 transition-colors">{draft.title}</h2>
            <p className="text-stone-500 line-clamp-3 mb-6 leading-relaxed">{draft.content}</p>
<Link 
  href={`/write?id=${draft.id}`} 
  className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-900 bg-stone-50 px-4 py-2 rounded-full hover:bg-stone-100"
>
  Continue Writing
</Link>


          </div>
        )) : (
          <div className="col-span-full py-20 border-2 border-dashed border-stone-100 rounded-3xl text-center">
            <p className="text-stone-300 font-sans text-xs uppercase tracking-widest">No drafts found</p>
          </div>
        )}
      </div>
    </div>
  );
}