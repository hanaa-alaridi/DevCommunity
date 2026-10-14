import Link from "next/link";
import { getCommunities } from "@/lib/queries";
import { CommunitiesPageProps } from "@/types/communities";

export const revalidate = 60;

export default async function CommunitiesPage({ searchParams }: CommunitiesPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || resolvedParams.query;
  const communities = await getCommunities(searchQuery);
  return (
    <div className="space-y-8 max-w-7xl mx-auto text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Communities
          </h1>
          <p>
            Discover technical ecosystems, join discussions, and collaborate with developers worldwide.
          </p>
        </div>
          <Link href="/communities/create" className="bg-brand hover:bg-brand-hover text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition shadow-md shadow-emerald-500/10 self-start md:self-auto">
            + Create Community
          </Link>
      </div> 
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col md:flex-row gap-3 justify-between items-center">
        <form action="/communities" method="GET" className="w-full flex gap-2">
          <input type="text" name="search" defaultValue={searchQuery || ""} placeholder="Search communities by name or description..." className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand"/>
          <button type="submit" className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 hover:text-white transition font-medium">
            Search
          </button>
        </form>
      </div>
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Active Filter:</span>
            <span className="bg-zinc-800 text-brand px-2.5 py-1 rounded-md border border-zinc-700">
              Search: "{searchQuery}"
            </span>
          </div>
          <Link href="/communities" className="text-xs text-brand hover:underline font-medium">
            Clear Search ✕
          </Link>
        </div>
      )}
      {communities.length === 0 ? (
        <div className="p-12 rounded-xl border border-surface-border bg-surface/50 text-center space-y-3">
          <p className="text-zinc-400">No communities created yet</p>
          <Link href="/communities/create" className="inline-block text-brand hover:underline text-sm font-medium">
            Be the first to create one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((community: any) => (
            <Link key={community._id} href={`/communities/${community.slug}`} className="group p-6 rounded-xl border border-surface-border bg-surface hover:border-zinc-700 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-white group-hover:text-brand transition line-clamp-1">
                    {community.name}
                  </h2>
                  <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50 shrink-0">
                    {community.members?.length || 0} members
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {community.description}
                </p>
              </div>
              <div className="space-y-3 pt-3 border-t border-surface-border">
                {community.topics && community.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {community.topics.map((topic: string) => (
                      <span key={topic} className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2 py-0.5 rounded text-[11px] font-medium">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <span>Created by @{community.creator?.username || "developer"}</span>
                  <span className="text-brand group-hover:underline font-medium">View</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}