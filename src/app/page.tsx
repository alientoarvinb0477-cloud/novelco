"use client";

import { useState } from 'react';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const sampleNovels = [
    { id: 1, title: "The Silence of the Code", author: "ARVIN A.", time: "12 MIN READ", category: "THRILLER" },
    { id: 2, title: "Echoes of the Atelier", author: "SARAH J.", time: "15 MIN READ", category: "DRAMA" },
    { id: 3, title: "Midnight in Valenzuela", author: "MARCUS L.", time: "10 MIN READ", category: "NOIR" },
    { id: 4, title: "The Last Compiler", author: "ELENA R.", time: "20 MIN READ", category: "SCI-FI" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 md:px-8 py-5">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tighter">NovelArc</div>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-8 text-xs font-bold font-sans uppercase tracking-widest text-stone-400">
            <Link href="/" className="text-stone-900 border-b-2 border-stone-900 pb-1">Library</Link>
            <Link href="/community" className="hover:text-orange-700 transition-colors">Community</Link>
            <Link href="/marketplace" className="hover:text-orange-700 transition-colors">Marketplace</Link>
            {isLoaded && isSignedIn && (
              <Link href="/profile" className="hover:text-orange-700 transition-colors">My Space</Link>
            )}
          </div>

          {/* Right Side: Auth & Menu Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button className="bg-stone-900 text-white px-6 py-2 rounded-full font-sans text-xs hover:bg-orange-700 transition-all cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              )}
              {isLoaded && isSignedIn && <UserButton />}
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className={`h-0.5 w-6 bg-stone-900 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-6 bg-stone-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-6 bg-stone-900 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 flex flex-col p-6 space-y-6 font-sans text-sm font-bold uppercase tracking-widest text-stone-500">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Library</Link>
            <Link href="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
            <Link href="/marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
            
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>My Space</Link>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-bold">Account</span>
                  <UserButton />
                </div>
              </>
            ) : isLoaded && (
              <SignInButton mode="modal">
                <button className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto pt-16 md:pt-24 pb-20 md:pb-32 px-6 text-center">
        <h1 className="text-5xl md:text-8xl mb-8 leading-tight font-bold">
          Write your story. <br />
          <span className="italic text-stone-400 font-light">Find your tribe.</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-500 font-sans max-w-2xl mx-auto leading-relaxed mb-12 px-4">
          The minimalist platform for novelists to publish their work and connect with a community that loves deep reading.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 font-sans font-bold">
          <Link href="/library" className="w-full md:w-auto">
            <button className="w-full bg-stone-900 text-white px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
              Start Reading
            </button>
          </Link>
          <Link href="/write" className="w-full md:w-auto">
            <button className="w-full border-2 border-stone-200 px-10 py-4 rounded-xl hover:bg-stone-50 transition-colors font-sans font-bold cursor-pointer">
              Publish a Novel
            </button>
          </Link>
        </div>
      </header>

      {/* Novels Grid (The Library) */}
      <section className="bg-stone-100/50 py-16 md:py-24 border-t border-stone-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-xs font-bold font-sans uppercase tracking-[0.3em] text-stone-400 mb-2">Featured Works</h2>
              <p className="text-3xl italic">Editor's Picks</p>
            </div>
            <Link href="/library" className="text-stone-400 font-sans text-xs font-bold uppercase tracking-widest hover:text-orange-700 transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sampleNovels.map((novel) => (
              <div key={novel.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-white border border-stone-200 rounded-lg mb-6 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 flex flex-col p-8 justify-between relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-bold font-sans tracking-widest text-orange-700">{novel.category}</span>
                  <h3 className="text-2xl italic leading-tight mb-4 group-hover:text-orange-700 transition-colors">"{novel.title}"</h3>
                  <div className="font-sans text-[10px] font-bold text-stone-400 tracking-widest uppercase">
                    <span>{novel.author}</span>
                    <span className="mx-2">•</span>
                    <span>{novel.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
