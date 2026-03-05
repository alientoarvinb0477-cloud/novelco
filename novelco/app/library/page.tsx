"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function LibraryPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      // This pulls your real data from the 'stories' table you just created
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching stories:", error.message);
      } else {
        setStories(data || []);
      }
      setLoading(false);
    }
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-stone-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold tracking-tighter">NovelCo.</Link>
        <UserButton />
      </nav>

      <main className="max-w-6xl mx-auto py-20 px-6">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl italic mb-4">The Library.</h1>
          <p className="font-sans text-stone-400 uppercase tracking-widest text-xs font-bold">Explore real stories from our community</p>
        </header>

        {loading ? (
          <p className="text-center font-sans text-stone-300">Loading the shelves...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stories.map((story) => (
              <Link href={`/read/${story.id}`} key={story.id} className="group">
                <div className="aspect-[3/4] bg-white border-l-8 border-stone-900 rounded-r-xl shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 p-10 flex flex-col justify-between">
                  <span className="text-[10px] font-bold font-sans tracking-widest text-stone-400 uppercase">NOVEL</span>
                  <h3 className="text-3xl italic leading-tight group-hover:text-orange-700 transition-colors">"{story.title}"</h3>
                  <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-stone-900">
                    By {story.author_name}
                  </div>

<div className="flex justify-between mt-4 font-sans text-[10px] text-stone-400">
  <span>👁️ {story.views || 0} views</span>
  <span>❤️ {story.hearts || 0}</span>
</div>


                </div>
              </Link>
            ))}
            {stories.length === 0 && (
              <p className="col-span-3 text-center text-stone-400 font-sans italic">The library is empty. Be the first to publish!</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}