import Link from "next/link";
import { getPosts, getCommunities } from "@/lib/queries";
import { BlogsPageProps } from "@/types/blogs";

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || resolvedParams.query;
  const topic = resolvedParams.topic;
  const community = resolvedParams.community;
  const sort = resolvedParams.sort || "newest";
  const page = Number(resolvedParams.page) || 1;
  const [{ posts, pagination }, communities] = await Promise.all([getPosts({
    search: searchQuery,
    topic: topic,
    communityId: community,
    sort: sort,
    page: page,
    limit: 6
    }),
    getCommunities(),
  ]);
  return (
    <div className="space-y-8 max-w-6xl mx-auto text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Technical Blogs
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-1">
            Read engineering tutorials, architecture breakdowns, and tech insights from developers.
          </p>
        </div>
        <Link href="/create" className="bg-brand hover:bg-brand-hover text-black font-semibold px-4 py-2 rounded-lg text-sm transition shadow-md shadow-emerald-500/10 shrink-0 self-start md:self-auto">
          + Write a Blog
        </Link>
      </div>
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col md:flex-row gap-3 justify-between items-center">
        <form action="/blogs" method="GET" className="w-full md:w-auto flex-1 flex gap-2">
          {topic && <input type="hidden" name="topic" value={topic} />}
          {community && <input type="hidden" name="community" value={community} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <input type="text" name="search" defaultValue={searchQuery || ""} placeholder="Search blogs by title or content..." className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand"/>
          <button type="submit" className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 hover:text-white transition font-medium">
            Search
          </button>
        </form>
        <div className="flex items-center gap-2 text-xs text-zinc-400 w-full md:w-auto justify-end">
          <span className="text-zinc-500 font-medium">Sort:</span>
          {(["newest", "popular", "oldest"] as const).map((s) => {
            const params = new URLSearchParams();
            if (searchQuery) params.set("search", searchQuery);
            if (topic) params.set("topic", topic);
            if (community) params.set("community", community);
            params.set("sort", s);
            const isActive = sort === s;
            return (
              <Link key={s} href={`/blogs?${params.toString()}`} className={`capitalize px-2.5 py-1 rounded-md text-[11px] font-medium transition ${isActive ? "bg-brand text-black font-semibold" : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"}`}>
                {s}
              </Link>
            );
          })}
        </div>
      </div>
      {(searchQuery || topic || community || sort !== "newest") && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400 font-medium">Active Filters:</span>
            {searchQuery && (
              <span className="bg-zinc-800 text-brand px-2.5 py-1 rounded-md border border-zinc-700">
                Search: "{searchQuery}"
              </span>
            )}
            {topic && (
              <span className="bg-zinc-800 text-brand px-2.5 py-1 rounded-md border border-zinc-700">
                Topic: #{topic}
              </span>
            )}
            {community && (
              <span className="bg-zinc-800 text-brand px-2.5 py-1 rounded-md border border-zinc-700">
                Community: {communities.find((c: any) => c._id === community)?.name || community}
              </span>
            )}
            {sort !== "newest" && (
              <span className="bg-zinc-800 text-brand px-2.5 py-1 rounded-md border border-zinc-700 capitalize">
                Sort: {sort}
              </span>
            )}
          </div>
          <Link href="/blogs" className="text-xs text-brand hover:underline font-medium">
            Clear Filters ✕
          </Link>
        </div>
      )}
      {posts.length === 0 ? (
        <div className="p-12 rounded-xl border border-zinc-800 bg-zinc-950 text-center space-y-3">
          <p className="text-zinc-400">
            {searchQuery || topic || community ? "No blogs match your search filters" : "No blogs published yet"}
          </p>
          <Link href={searchQuery || topic || community ? "/blogs" : "/create"} className="inline-block text-brand hover:underline text-sm font-medium">
            {searchQuery || topic || community ? "View all blogs →" : "Be the first to publish →"}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {posts.map((post: any) => (
              <Link key={post._id} href={`/blogs/${post.slug}`} className="group p-6 rounded-xl border border-surface-border bg-surface hover:border-zinc-700 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2.5 py-0.5 rounded-full font-medium">
                      {post.community?.name || "General"}
                    </span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-brand transition line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-surface-border">
                  <span>By @{post.author?.username || "developer"}</span>
                  <span className="text-brand group-hover:underline font-medium">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-400">
              <span>
                Page <strong className="text-white">{pagination.currentPage}</strong> of{" "}
                <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalPosts} total posts)
              </span>
              <div className="flex items-center gap-2">
                {pagination.hasPrevPage ? (
                  <Link href={{ pathname: "/blogs", query: { ...(searchQuery && { search: searchQuery }), ...(topic && { topic }), ...(community && { community }), ...(sort && { sort }), page: pagination.currentPage - 1}}} className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-white hover:border-zinc-700 transition font-medium">
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed font-medium">
                    ← Previous
                  </span>
                )}
                {pagination.hasNextPage ? (
                  <Link href={{ pathname: "/blogs", query: { ...(searchQuery && { search: searchQuery }), ...(topic && { topic }), ...(community && { community }), ...(sort && { sort }), page: pagination.currentPage + 1}}} className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-white hover:border-zinc-700 transition font-medium">
                    Next →
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed font-medium">
                    Next →
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}