"use client";

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Library() {
  const books = [
    { id: "1", title: "The Silence of the Code", author: "ARVIN A.", category: "THRILLER", color: "border-orange-700" },
    { id: "2", title: "Echoes of the Atelier", author: "SARAH J.", category: "DRAMA", color: "border-stone-400" },
    { id: "3", title: "Midnight in Valenzuela", author: "MARCUS L.", category: "NOIR", color: "border-blue-900" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-stone-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold tracking-tighter">NovelCo.</Link>
        <UserButton />
      </nav>

      <main className="max-w-6xl mx-auto py-20 px-6">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl italic mb-4">The Library.</h1>
          <p className="font-sans text-stone-400 uppercase tracking-widest text-xs font-bold">Explore the collection</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {books.map((book) => (
            <Link href={`/read/${book.id}`} key={book.id} className="group">
              <div className={`aspect-[3/4] bg-white border-l-8 ${book.color} rounded-r-xl shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 p-10 flex flex-col justify-between relative overflow-hidden`}>
                <span className="text-[10px] font-bold font-sans tracking-widest text-stone-400 uppercase">{book.category}</span>
                <h3 className="text-3xl italic leading-tight group-hover:text-orange-700 transition-colors">"{book.title}"</h3>
                <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-stone-900">
                  By {book.author}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}