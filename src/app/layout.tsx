"use client"; // We need this for the mobile menu state

import "./globals.css";
import { ClerkProvider, SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, ShoppingBag, User, Home } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning className="bg-[#FDFCFB] text-stone-900 selection:bg-orange-100 antialiased">
          
          {/* --- GLOBAL NAVIGATION --- */}
          <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex justify-between items-center h-20">
              
              {/* Logo */}
              <Link href="/" className="text-xl font-bold tracking-tighter hover:text-orange-700 transition-colors">
                NovelArc<span className="text-orange-700">.</span>
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
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-stone-900">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className="md:hidden bg-white border-b border-stone-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
                <nav className="flex flex-col gap-5 text-xs font-bold font-sans uppercase tracking-[0.2em] text-stone-500">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><Home size={14}/> Home</Link>
                  <Link href="/library" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><BookOpen size={14}/> Library</Link>
                  <Link href="/marketplace" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><ShoppingBag size={14}/> Marketplace</Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><User size={14}/> My Space</Link>
                </nav>
                <div className="pt-6 border-t border-stone-50">
                   <AuthButtons mobile />
                </div>
              </div>
            )}
          </nav>

          {/* --- MAIN CONTENT WRAPPER --- */}
          <main className="pt-20 min-h-screen flex flex-col">
            <div className="flex-grow w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-10">
              {children}
            </div>
            
            <footer className="py-20 border-t border-stone-100 text-center">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">
                © 2026 NovelArc Studio • Valenzuela City
              </p>
            </footer>
          </main>

        </body>
      </html>
    </ClerkProvider>
  );
}

// Sub-component for Auth to keep things clean
function AuthButtons({ mobile }: { mobile?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className={`${mobile ? 'w-full' : ''} bg-stone-900 text-white px-6 py-3 rounded-xl font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md`}>
          Sign In
        </button>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {!mobile && (
        <Link href="/profile" className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
          Dashboard
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
