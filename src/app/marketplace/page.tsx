"use client";

import "./globals.css";
import { ClerkProvider, SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, ShoppingBag, User, Home, Globe } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning className="bg-[#FDFCFB] text-stone-900 selection:bg-orange-100 antialiased font-serif">
          
          {/* --- GLOBAL NAVIGATION --- */}
          <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex justify-between items-center h-20">
              
              {/* Logo */}
              <Link href="/" className="text-xl font-bold tracking-tighter hover:text-orange-700 transition-colors">
                NovelArc<span className="text-orange-700">.</span>Studio
              </Link>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-10">
                <div className="flex gap-8 text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">
                  <Link href="/library" className="hover:text-stone-900 transition-colors">Library</Link>
                  <Link href="/marketplace" className="hover:text-stone-900 transition-colors">Marketplace</Link>
                  <Link href="/community" className="hover:text-stone-900 transition-colors">Community</Link>
                </div>
                
                <div className="h-4 w-[1px] bg-stone-200" />
                
                <AuthButtons />
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden p-2 text-stone-900 transition-transform active:scale-90"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className="md:hidden bg-white border-t border-stone-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
                <nav className="flex flex-col gap-5 text-xs font-bold font-sans uppercase tracking-[0.2em] text-stone-500">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <Home size={14}/> Home
                  </Link>
                  <Link href="/library" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <BookOpen size={14}/> Library
                  </Link>
                  <Link href="/marketplace" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <ShoppingBag size={14}/> Marketplace
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <Globe size={14}/> My Workspace
                  </Link>
                </nav>
                <div className="pt-6 border-t border-stone-50">
                   <AuthButtons mobile />
                </div>
              </div>
            )}
          </nav>

          {/* --- MAIN CONTENT WRAPPER --- */}
          {/* pt-20 matches the height of our fixed nav (h-20) */}
          <main className="pt-20 min-h-screen flex flex-col">
            <div className="flex-grow w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-6 md:pt-10">
              {children}
            </div>
            
            {/* Global Footer */}
            <footer className="py-20 border-t border-stone-100 text-center bg-stone-50/30">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">
                © 2026 NovelArc Studio • Valenzuela City Business OS
              </p>
            </footer>
          </main>

        </body>
      </html>
    </ClerkProvider>
  );
}

// Sub-component for Auth to handle Clerk v5+ logic
function AuthButtons({ mobile }: { mobile?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-stone-100 animate-pulse" />;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className={`${mobile ? 'w-full py-4' : 'px-6 py-2'} bg-stone-900 text-white rounded-xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md`}>
          Sign In
        </button>
      </SignInButton>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${mobile ? 'justify-between' : ''}`}>
      {!mobile && (
        <Link href="/profile" className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
          My Space
        </Link>
      )}
      {mobile && <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Account</span>}
      
      {/* FIXED: Removed afterSignOutUrl prop which caused the Vercel build error.
          In Clerk v5+, redirection is handled via environment variables 
          or your dashboard settings.
      */}
      <UserButton />
    </div>
  );
}
