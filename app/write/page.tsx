"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { supabase } from "@/lib/supabase"; 
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function WriteNovel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id"); // Grab the ID from the URL (?id=...)
  const { user, isLoaded } = useUser(); 
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 1. FETCH PREVIOUS TEXT ON LOAD
  useEffect(() => {
    if (draftId) {
      const loadDraft = async () => {
        const { data, error } = await supabase
          .from('stories')
          .select('title, content')
          .eq('id', draftId)
          .single();

        if (data && !error) {
          setTitle(data.title);
          setContent(data.content);
        } else if (error) {
          console.error("Error loading draft:", error.message);
        }
      };
      loadDraft();
    }
  }, [draftId]);

  const handleSave = async (isPublishing: boolean) => {
    if (!title || !content) return alert("Please fill in both title and content.");
    if (!user) return alert("You must be signed in to save.");

    setIsSaving(true);

    const storyData = { 
      title, 
      content, 
      author_name: user.fullName || "Anonymous",
      user_id: user.id,
      is_draft: !isPublishing 
    };

    // 2. LOGIC TO EITHER UPDATE OR INSERT
    let result;
    if (draftId) {
      // If we have an ID, update the existing record
      result = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', draftId);
    } else {
      // If no ID, create a new record
      result = await supabase
        .from('stories')
        .insert([storyData]);
    }

    if (result.error) {
      alert("Error: " + result.error.message);
    } else {
      alert(isPublishing ? "Success! Story is live." : "Draft saved.");
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
                className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 disabled:opacity-50"
              >
                {isSaving ? "SAVING..." : "Save Draft"}
              </button>

              <button 
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="bg-stone-900 text-white px-6 py-2 rounded-full font-sans text-xs font-bold hover:bg-orange-700 disabled:bg-stone-400 transition-all"
              >
                {isSaving ? "PUBLISHING..." : "PUBLISH NOW"}
              </button>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-orange-50 text-orange-800 px-6 py-2 rounded-full font-sans text-xs font-bold hover:bg-orange-100 uppercase tracking-widest">
                Sign in to Publish
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-20 px-6">
        <input
          type="text"
          placeholder="Title..."
          className="w-full text-6xl font-bold bg-transparent border-none outline-none mb-12 placeholder:text-stone-100"
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