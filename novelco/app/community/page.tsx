export default function CommunityPage() {
  const posts = [
    { id: 1, author: "Arvin", content: "Just reached 10k words on my first novel! 🚀", likes: 24 },
    { id: 2, author: "Sarah", content: "Any tips for overcoming writer's block in Chapter 3?", likes: 12 }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-serif">
      <main className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Community Thoughts</h1>
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <p className="font-sans font-bold text-sm mb-2 text-stone-500">@{post.author.toLowerCase()}</p>
              <p className="text-lg mb-4 leading-relaxed">{post.content}</p>
              <div className="flex gap-4 text-stone-400 text-sm font-sans">
                <span>❤️ {post.likes}</span>
                <span className="cursor-pointer hover:text-stone-900">Reply</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}