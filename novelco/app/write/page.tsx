"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function WriteNovel() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert("Please give your story a title and some content!");
      return;
    }

    // Logic for saving to a database will go here later
    console.log("Publishing Novel:", { title, content });
    alert("Masterpiece Published! Redirecting to Library...");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      {/* Editor Header */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-stone-200 bg-white/80 sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tighter">NovelCo.</Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePublish}
            className="bg-stone-900 text-white px-6 py-2 rounded-full font-sans text-xs font-bold hover:bg-orange-700 transition-all shadow-md"
          >
            PUBLISH NOW
          </button>
          <UserButton />
        </div>
      </nav>

      {/* Writing Canvas */}
      <main className="max-w-3xl mx-auto pt-20 pb-40 px-6">
        <textarea
          placeholder="Title of your masterpiece..."
          className="w-full text-5xl md:text-7xl font-bold bg-transparent border-none outline-none mb-12 placeholder:text-stone-200 resize-none overflow-hidden"
          rows={1}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <textarea
          placeholder="Begin your story here..."
          className="w-full h-[60vh] text-xl md:text-2xl leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-stone-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </main>

      {/* Word Count / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 px-8 border-t border-stone-100 bg-white/50 backdrop-blur-sm flex justify-between text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">
        <div>Drafting Mode</div>
        <div>{content.split(/\s+/).filter(Boolean).length} Words</div>
      </footer>
    </div>
  );
}