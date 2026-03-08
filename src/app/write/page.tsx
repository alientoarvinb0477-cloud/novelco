"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function WriteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id");
  const { user, isLoaded } = useUser();  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (draftId) {
      const loadDraft = async () => {
        const { data, error } = await supabase
          .from('stories')
          .select('title, content')
          .eq('id', draftId)
          .single();
        if (data && !error) { 
          setTitle(data.title || ""); 
          setContent(data.content || ""); 
        }
      };
      loadDraft();
    }
  }, [draftId]);

  const handleSave = async (isPublishing: boolean) => {
    if (!title || !content || !user) return;
    setIsSaving(true);
    
    const storyData = { 
      title, 
      content, 
      author_name: user.fullName || "Anonymous", 
      user_id: user.id, 
      is_draft: !isPublishing 
    };

    const result = draftId 
      ? await supabase.from('stories').update(storyData).eq('id', draftId) 
      : await supabase.from('stories').insert([storyData]);

    if (!result.error) {
      router.push(isPublishing ? "/library" : "/profile"); 
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-stone-200 bg-white/80 sticky top-0 z-10 backdrop-blur-md">
        <Link href="/" className="text-xl font-bold tracking-tighter">NovelCo.</Link>
        <div className="flex items-center gap-4">
          {isLoaded && user ? (
            <>
              <button 
                onClick={() => handleSave(false)} 
                disabled={isSaving} 
                className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400"
              >
                {isSaving ? "SAVING..." : "Save Draft"}
              </button>
              <button 
                onClick={() => handleSave(true)} 
                disabled={isSaving} 
                className="bg-stone-900 text-white px-6 py-2 rounded-full font-sans text-xs font-bold"
              >
                {isSaving ? "PUBLISHING..." : "PUBLISH NOW"}
              </button>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-stone-900 text-white px-6 py-2 rounded-full font-sans text-xs font-bold">Sign in</button>
            </SignInButton>
          )}
        </div>
      </nav>
      <main className="max-w-3xl mx-auto pt-20 px-6 text-left">
        <input 
          type="text" 
          placeholder="Title..." 
          className="w-full text-6xl font-bold bg-transparent border-none outline-none mb-12" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          placeholder="Begin your story..." 
          className="w-full h-[60vh] text-xl leading-relaxed bg-transparent border-none outline-none resize-none" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
      </main>
    </div>
  );
}

export default function WriteNovelPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-sans text-stone-400">Loading Editor...</div>}>
      <WriteEditor />
    </Suspense>
  );
}
