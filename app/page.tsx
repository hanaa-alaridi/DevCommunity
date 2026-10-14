import Link from "next/link";
import { getCommunities, getPosts } from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [communities, {posts}] = await Promise.all([
    getCommunities(),
    getPosts()
  ]);
  return (
    <div className="space-y-10 max-w-6xl mx-auto text-zinc-100">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/30 via-emerald-850/30 to-emerald-700/50 border border-surface-border p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-semibold tracking-wider text-brand uppercase">
            BUILD • SHARE • LEARN
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Explore developer communities
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Join tech ecosystems, read technical blogs, share your expertise, and connect with developers worldwide.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/communities" className="bg-brand hover:bg-brand-hover text-black font-semibold px-5 py-2.5 rounded-lg transition text-sm shadow-lg shadow-emerald-500/10">
              Browse Communities
            </Link>
            <Link href="/create" className="bg-surface hover:bg-zinc-800 text-zinc-200 border border-surface-border font-medium px-5 py-2.5 rounded-lg transition text-sm">
              Create a Post
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Featured Communities
          </h2>
          <Link href="/communities" className="text-sm text-brand hover:underline">View All</Link>
        </div>
        {communities.length === 0 ? (
          <div className="p-8 rounded-xl border border-surface-border bg-surface/50 text-center text-zinc-400">
            No communities created yet
          </div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communities.slice(0, 6).map((community: any) => (
              <Link key={community._id} href={`/communities/${community.slug}`} className="group p-5 rounded-xl border border-surface-border bg-surface hover:border-zinc-700 transition flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-brand transition">
                    {community.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {community.description}
                  </p>
                </div>
                <div className=" flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-surface-border">
                  <span>{community.members?.length || 0} members</span>
                  <div className="flex gap-1">
                    {community.topics?.slice(0, 2).map((topic: string) => (
                      <span key={topic} className="bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded text-[10px]">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Latest Technical Blogs
          </h2>
          <Link href="/blogs" className="text-sm text-brand hover:underline">
            View All
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="p-8 rounded-xl border border-surface-border bg-surface/50 text-center text-zinc-400">
            No posts published yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <Link key={post._id} href={`/blogs/${post.slug}`} className="group p-5 rounded-xl border border-surface-border bg-surface hover:border-zinc-700 transition space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2.5 py-0.5 rounded-full font-medium">
                    {post.community?.name || "General"}
                  </span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {month:"short", day:"numeric"})}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand transition line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-surface-border">
                  <span>By @{post.author?.username || "developer"}</span>
                  <span className="text-brand group-hover:underline">Read blog</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}