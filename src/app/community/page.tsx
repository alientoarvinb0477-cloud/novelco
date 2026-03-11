"use client";

import { useState, useEffect } from "react";
import { supabase } from "@lib/supabase";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function CommunityWall() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // 1. Fetch posts with nested reactions and comments
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        reactions (id, user_id),
        comments (*)
      `)
      .order("created_at", { ascending: false });
    
    if (!error && data) setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. Handle New Post
  const handlePostSubmit = async () => {
    if (!newPost.trim() || !user) return;
    setIsPosting(true);

    const { error } = await supabase.from("posts").insert([
      {
        content: newPost,
        username: user.fullName || "Anonymous Author",
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setNewPost("");
      fetchPosts(); 
    }
    setIsPosting(false);
  };

  // 3. Handle Heart Reaction
const handleHeart = async (postId: string) => {
  if (!user) return alert("Sign in to react!");

  const { error } = await supabase.from("reactions").insert([
    { post_id: postId, user_id: user.id }
  ]);

  if (error) {
    // 42501 is the unique constraint error code
    if (error.code === '23505') { 
      console.log("User already liked this post.");
    } else {
      alert("Error: " + error.message);
    }
  } else {
    fetchPosts();
  }
};

  // 4. Handle Comment Submission
 const handleComment = async (postId: string, text: string) => {
  if (!user || !text.trim()) return;

  const { error } = await supabase.from("comments").insert([
    {
      post_id: postId,
      user_id: user.id,
      username: user.fullName || "Anonymous",
      comment_text: text, // Matches your schema column
    },
  ]);

  if (error) {
    alert("Comment Error: " + error.message);
  } else {
    fetchPosts();
  }
};




  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-serif">
      {/* Navigation matching WriteNovel */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold tracking-tighter">NovelArcStudio.</Link>
      </nav>

      <main className="max-w-2xl mx-auto pt-16 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Community Thoughts</h1>
        <p className="text-stone-500 font-sans italic mb-12 text-lg">Shared moments from fellow writers.</p>

        {/* Post Input Box */}
        {isLoaded && user ? (
          <div className="mb-16 pb-12 border-b border-stone-100 text-left">
            <textarea
              placeholder="What are you feeling today?"
              className="w-full text-2xl bg-transparent border-none outline-none resize-none placeholder:text-stone-200 min-h-[120px]"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePostSubmit}
                disabled={isPosting || !newPost.trim()}
                className="bg-stone-900 text-white px-8 py-2 rounded-full font-sans text-xs font-bold hover:bg-orange-700 transition-all disabled:opacity-20"
              >
                {isPosting ? "SHARING..." : "SHARE THOUGHT"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-16 p-8 border border-dashed border-stone-200 rounded-2xl">
            <p className="text-stone-400 font-sans text-xs uppercase tracking-widest">Sign in to join the conversation</p>
          </div>
        )}

        {/* The Wall Feed */}
        <div className="space-y-12 pb-20 text-left">
          {posts.map((post) => (
            <article key={post.id} className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-orange-800">@{post.username}</span>
                <span className="text-[10px] font-sans text-stone-300 uppercase">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              
              <p className="text-xl leading-relaxed text-stone-800 mb-6">{post.content}</p>
              
              <div className="flex gap-6 items-center border-t border-stone-50 pt-4">
                {/* Heart Button */}
                <button 
                  onClick={() => handleHeart(post.id)}
                  className="flex items-center gap-2 group"
                >
                  <span className="text-red-400 text-lg group-active:scale-150 transition-transform">❤️</span>
                  <span className="font-sans text-xs font-bold text-stone-400">{post.reactions?.length || 0}</span>
                </button>

                {/* Reply Toggle */}
                <button 
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                  className="font-sans text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900"
                >
                  {post.comments?.length || 0} Replies
                </button>
              </div>

              {/* Sliding Comment Section */}
              {activePostId === post.id && (
                <div className="mt-6 pt-6 border-t border-stone-50 transition-all">
                  <div className="space-y-4 mb-6">
                    {post.comments?.map((comment: any) => (
                      <div key={comment.id} className="bg-stone-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-sans font-bold uppercase text-stone-400 mb-1">@{comment.username}</p>
                        <p className="text-sm text-stone-700 font-sans">{comment.comment_text}</p>
                      </div>
                    ))}
                  </div>

                  {user && (
                    <input 
                      type="text"
                      placeholder="Write a reply... (Press Enter)"
                      className="w-full bg-stone-100 border-none rounded-full px-6 py-2 text-sm font-sans outline-none focus:ring-1 focus:ring-orange-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(post.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
