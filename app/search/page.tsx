import Link from "next/link";
import { getPosts, getCommunities } from "@/lib/queries";
import { SearchPageProps } from "@/types/search";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || resolvedParams.search || resolvedParams.query || "";
  const [{ posts }, communities] = q ? await Promise.all([
    getPosts({ search: q, limit: 10 }),
    getCommunities(q),
  ]) : [{ posts: [] }, []];
  const totalResults = communities.length + posts.length;
  return (
    <div className="space-y-10 max-w-5xl mx-auto text-zinc-100">
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Global Search Results
        </h1>
        {q ? (
          <p className="text-sm text-zinc-400">
            Found <strong className="text-brand">{totalResults}</strong> result
            {totalResults === 1 ? "" : "s"} for "{q}"
          </p>
        ) : (
          <p className="text-sm text-zinc-400">
            Enter a search keyword in the navbar to find communities and blog posts.
          </p>
        )}
      </div>
      {!q ? (
        <div className="p-12 rounded-xl border border-zinc-800 bg-zinc-950 text-center space-y-2">
          <p className="text-zinc-400">No search query provided.</p>
          <Link href="/blogs" className="inline-block text-brand hover:underline text-sm font-medium">
            Explore all blogs →
          </Link>
        </div>
      ) : totalResults === 0 ? (
        <div className="p-12 rounded-xl border border-zinc-800 bg-zinc-950 text-center space-y-3">
          <p className="text-zinc-400">
            No communities or blog posts matched "{q}".
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/blogs" className="text-brand hover:underline font-medium">
              Browse Blogs →
            </Link>
            <Link href="/communities" className="text-brand hover:underline font-medium">
              Browse Communities →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Communities
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                  {communities.length}
                </span>
              </h2>
              {communities.length > 0 && (
                <Link href={`/communities?search=${encodeURIComponent(q)}`} className="text-xs text-brand hover:underline font-medium">
                  View in Communities →
                </Link>
              )}
            </div>
            {communities.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">
                No matching communities found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities.map((community: any) => (
                  <Link key={community._id} href={`/communities/${community.slug}`} className="group p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-white group-hover:text-brand transition line-clamp-1 text-base">
                        {community.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {community.description}
                      </p>
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-900 flex justify-between items-center">
                      <span>{community.members?.length || 0} members</span>
                      <span className="text-brand group-hover:underline">
                        Visit →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Blog Posts
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                  {posts.length}
                </span>
              </h2>
              {posts.length > 0 && (
                <Link href={`/blogs?search=${encodeURIComponent(q)}`} className="text-xs text-brand hover:underline font-medium">
                  View in Blogs →
                </Link>
              )}
            </div>
            {posts.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">
                No matching blog posts found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post: any) => (
                  <Link key={post._id} href={`/blogs/${post.slug}`} className="group p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2 py-0.5 rounded-full font-medium text-[11px]">
                          {post.community?.name || "General"}
                        </span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-brand transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-900">
                      <span>By @{post.author?.username || "developer"}</span>
                      <span className="text-brand group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}