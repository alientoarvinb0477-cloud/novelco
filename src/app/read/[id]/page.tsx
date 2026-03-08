"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Your database bridge
import Link from 'next/link';

export default function ReaderPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function fetchStoryAndIncrementViews() {
      // 1. Fetch the story details
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching story:", error.message);
        return;
      }

      if (data) {
        setStory(data);

        // 2. Increment view count in Supabase
        // This adds 1 to whatever the current view count is
        await supabase
          .from('stories')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      }
    }

    if (id) {
      fetchStoryAndIncrementViews();
    }
  }, [id]);

  const handleHeart = async () => {
    if (!story || isLiking) return;
    setIsLiking(true);

    // 3. Increment heart count in Supabase
    const { data, error } = await supabase
      .from('stories')
      .update({ hearts: (story.hearts || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      setStory(data); // Updates the UI with the new heart count immediately
    }
    
    setIsLiking(false);
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-stone-400">
        Opening the book...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif selection:bg-orange-100">
      {/* Top Navigation */}
      <nav className="max-w-prose mx-auto py-10 px-6 flex justify-between items-center text-stone-400 font-sans text-[10px] font-bold tracking-widest uppercase">
        <Link href="/library" className="hover:text-stone-900 transition-colors">
          ← Exit Reader
        </Link>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1">👁️ {story.views || 0}</span>
          <button 
            onClick={handleHeart}
            disabled={isLiking}
            className="flex items-center gap-1 hover:text-red-500 transition-colors active:scale-125"
          >
            ❤️ {story.hearts || 0}
          </button>
        </div>
      </nav>

      {/* Story Content */}
      <article className="max-w-prose mx-auto pt-20 pb-40 px-6">
        <header className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl italic mb-6 leading-tight">
            {story.title}
          </h1>
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-stone-400">
            By {story.author_name}
          </p>
        </header>

        {/* whitespace-pre-wrap ensures your paragraphs and spaces stay intact */}
        <div className="text-xl md:text-2xl leading-relaxed text-stone-800 whitespace-pre-wrap">
          {story.content}
        </div>

        {/* Bottom Reaction Button */}
        <footer className="mt-32 pt-10 border-t border-stone-100 flex flex-col items-center gap-4">
          <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">
            Enjoyed this story?
          </p>
          <button 
            onClick={handleHeart}
            className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center text-2xl hover:bg-red-50 hover:border-red-200 transition-all active:scale-90"
          >
            ❤️
          </button>
          <span className="font-sans text-xs font-bold">{story.hearts || 0} hearts</span>
        </footer>
      </article>
    </div>
  );
}