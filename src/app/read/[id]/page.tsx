"use client";

import { useEffect, useState, Suspense } from 'react'; // Added Suspense
import { useParams } from 'next/navigation';
import { supabase } from "@lib/supabase";
import Link from 'next/link';

function ReaderContent() { // Move logic to a child component
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function fetchStoryAndIncrementViews() {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        setStory(data);
        await supabase.from('stories').update({ views: (data.views || 0) + 1 }).eq('id', id);
      }
    }
    if (id) fetchStoryAndIncrementViews();
  }, [id]);

  const handleHeart = async () => {
    if (!story || isLiking) return;
    setIsLiking(true);
    const { data } = await supabase
      .from('stories')
      .update({ hearts: (story.hearts || 0) + 1 })
      .eq('id', id)
      .select().single();
    if (data) setStory(data);
    setIsLiking(false);
  };

  if (!story) return <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-stone-400">Opening the book...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif selection:bg-orange-100">
      <nav className="max-w-prose mx-auto py-10 px-6 flex justify-between items-center text-stone-400 font-sans text-[10px] font-bold tracking-widest uppercase">
        <Link href="/library" className="hover:text-stone-900 transition-colors">← Exit Reader</Link>
        <div className="flex gap-6 items-center">
          <span>👁️ {story.views || 0}</span>
          <button onClick={handleHeart} disabled={isLiking} className="flex items-center gap-1 hover:text-red-500 transition-colors active:scale-125">
            ❤️ {story.hearts || 0}
          </button>
        </div>
      </nav>
      <article className="max-w-prose mx-auto pt-20 pb-40 px-6">
        <header className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl italic mb-6 leading-tight">{story.title}</h1>
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-stone-400">By {story.author_name}</p>
        </header>
        <div className="text-xl md:text-2xl leading-relaxed text-stone-800 whitespace-pre-wrap">{story.content}</div>
        <footer className="mt-32 pt-10 border-t border-stone-100 flex flex-col items-center gap-4">
          <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">Enjoyed this story?</p>
          <button onClick={handleHeart} className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center text-2xl hover:bg-red-50 hover:border-red-200 transition-all active:scale-90">❤️</button>
          <span className="font-sans text-xs font-bold">{story.hearts || 0} hearts</span>
        </footer>
      </article>
    </div>
  );
}

// Default export wrapped in Suspense
export default function ReaderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-serif text-stone-400">Loading...</div>}>
      <ReaderContent />
    </Suspense>
  );
}
