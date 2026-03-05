"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // This imports your bridge!
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function WriteNovel() {
  const router = useRouter();
  const { user } = useUser(); // This gets the logged-in user from Clerk
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

const handlePublish = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title || !content) return alert("Please fill in both title and content.");

  setIsPublishing(true);

  // We removed 'category' from here so it matches your Supabase table exactly
  const { error } = await supabase.from('stories').insert([
    { 
      title: title, 
      content: content, 
      author_name: user?.fullName || "Anonymous Author" 
    }
  ]);

  if (error) {
    alert("Error: " + error.message);
    setIsPublishing(false);
  } else {
    alert("Success! Your story is now live.");
    router.push("/library"); 
  }
};

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-stone-200">
        <Link href="/" className="text-xl font-bold tracking-tighter">NovelCo.</Link>
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-stone-900 text-white px-6 py-2 rounded-full font-sans text-xs font-bold hover:bg-orange-700 disabled:bg-stone-400 transition-all"
          >
            {isPublishing ? "PUBLISHING..." : "PUBLISH NOW"}
          </button>
          <UserButton />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-20 px-6">
        <input
          type="text"
          placeholder="Title..."
          className="w-full text-6xl font-bold bg-transparent border-none outline-none mb-12 placeholder:text-stone-200"
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