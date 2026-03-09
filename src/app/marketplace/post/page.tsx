"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";
import { useUser, SignInButton } from "@clerk/nextjs"; // Added SignInButton
import Link from "next/link";

export default function PostProduct() {
  const router = useRouter();
  const { user, isLoaded } = useUser(); // Added isLoaded to track loading state
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    business: "",
    price: "",
    category: "Food",
    description: "",
    contact_info: "",
    image_url: ""
  });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Security check: You must be signed in!");

    setIsUploading(true);
    const { error } = await supabase.from('marketplace').insert([
      {
        ...formData,
        user_id: user.id,
        author_name: user.fullName || "Member"
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Product listed successfully!");
      router.push("/marketplace");
    }
    setIsUploading(false);
  };

  // 1. LIMIT: Check if user is signed in
  if (isLoaded && !user) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center font-serif p-6">
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">NovelCo. <span className="italic font-light text-stone-400">Seller Portal</span></h2>
        <p className="text-stone-500 font-sans mb-8 uppercase text-[10px] font-bold tracking-widest">Only registered members can post ads.</p>
        
        <SignInButton mode="modal">
          <button className="bg-stone-900 text-white px-10 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl">
            Sign In to Continue
          </button>
        </SignInButton>
        
        <Link href="/marketplace" className="mt-8 text-stone-400 font-sans text-[10px] font-bold uppercase tracking-widest hover:underline">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  // 2. SHOW FORM: Only if user is logged in
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif pb-20">
      <nav className="p-8 border-b border-stone-200">
        <Link href="/marketplace" className="text-xl font-bold tracking-tighter">NovelCo.</Link>
      </nav>

      <main className="max-w-2xl mx-auto pt-20 px-6">
        <h1 className="text-6xl font-bold mb-12 tracking-tighter">List your <span className="italic text-stone-400 font-light">Craft.</span></h1>
        
        <form onSubmit={handlePost} className="space-y-8 font-sans">
          {/* ... all your existing form inputs go here ... */}
          
          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-stone-900 text-white py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-orange-700 transition-all disabled:bg-stone-300"
          >
            {isUploading ? "PUBLISHING..." : "PUBLISH TO MARKETPLACE"}
          </button>
        </form>
      </main>
    </div>
  );
}