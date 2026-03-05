"use client";

import Link from 'next/link';

export default function Reader() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif selection:bg-orange-100">
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-1/4 h-1 bg-orange-700 z-50"></div>

      <nav className="max-w-prose mx-auto py-10 px-6 flex justify-between items-center text-stone-400 font-sans text-[10px] font-bold tracking-widest uppercase">
        <Link href="/library" className="hover:text-stone-900 transition-colors">← Exit Reader</Link>
        <span>Chapter One</span>
      </nav>

      <article className="max-w-prose mx-auto pt-20 pb-40 px-6">
        <header className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl italic mb-6">The Silence of the Code</h1>
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-stone-400">Arvin A.</p>
        </header>

        <div className="text-xl md:text-2xl leading-relaxed text-stone-800 space-y-10">
          <p className="first-letter:text-8xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-stone-900">
            The screen flickered with a violent violet hue that Arvin had never encountered in his twelve years of systems architecture. 
            The cooling fans in the server room, usually a comforting mechanical roar, had fallen deathly silent. 
          </p>
          <p>
            He reached for his coffee, but his hand stopped mid-air. The liquid in the ceramic mug was vibrating, 
            forming perfect concentric circles despite the lack of any physical tremor in the room. 
            Something was waking up inside the machine.
          </p>
          <p>
            "Status report," he whispered, his voice cracking. No one was there to answer, but the terminal 
            responded anyway. A single line of text scrolled across the screen: <i>WE REMEMBER THE ARCHITECT.</i>
          </p>
        </div>

        <footer className="mt-32 pt-10 border-t border-stone-200 flex justify-center">
          <button className="bg-stone-900 text-white px-12 py-4 rounded-full font-sans font-bold text-xs tracking-widest hover:bg-orange-700 transition-all shadow-lg">
            CONTINUE TO CHAPTER 2
          </button>
        </footer>
      </article>
    </div>
  );
}