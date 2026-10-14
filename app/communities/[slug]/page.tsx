import Link from "next/link"; 
import { notFound } from "next/navigation"; 
import { getCommunityBySlug, getPosts } from "@/lib/queries";
import { auth } from "@/auth";
import JoinCommunityButton from "@/components/CommunityButton";
import { CommunityPageProps } from "@/types/communities";

export const revalidate = 60;

export default async function CommunityDetailPage({ params }: CommunityPageProps) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) {
    notFound();
  }
  const { posts } = await getPosts({ communityId: community._id });
  const session = await auth();
  const memberIds = (community.members || []).map((m: any) =>
    typeof m === "string" ? m : m._id?.toString() || m.toString()
  );
  const isMember = Boolean(session?.user?.id && memberIds.includes(session.user.id));
  return (
    <div className="space-y-8 max-w-6xl mx-auto text-zinc-100">
      <Link href="/communities" className="inline-flex items-center text-xs text-zinc-400 hover:text-brand transition">
        ← Back to Communities    
      </Link>
      <div className="rounded-2xl bg-surface border border-surface-border p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                {community.name}
              </h1>
              <JoinCommunityButton communityId={community._id.toString()} initialIsMember={isMember} isLoggedIn={Boolean(session?.user)}/>
            </div>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              {community.description}
            </p>
          </div> 
          <Link href={`/create?community=${community._id}`} className="bg-brand hover:bg-brand-hover text-black font-semibold px-4 py-2 rounded-lg text-sm transition shadow-md shadow-emerald-500/10 shrink-0 self-start md:self-auto">
            + Post in Community
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-border text-xs text-zinc-500">
          <div className="flex flex-wrap gap-1.5">
            {community.topics?.map((topic: string) => (
              <span key={topic} className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2.5 py-0.5 rounded text-[11px] font-medium">
                #{topic}
              </span>
            ))}
          </div>
          <span>
            Created by
            <Link href={`/profile/${community.creator.username}`} className="text-brand font-semibold hover:underline">
              @{community.creator.username}
            </Link>
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Community Discussions & Articles</h2>
        {posts.length === 0 ? (
          <div className="p-12 rounded-xl border border-surface-border bg-surface/50 text-center space-y-3">
            <p className="text-zinc-400">No posts in this community yet</p>
            <Link href={`/create?community=${community._id}`} className="inline-block text-brand hover:underline text-sm font-medium">
              Write the first post →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <Link key={post._id} href={`/blogs/${post.slug}`} className="group p-5 rounded-xl border border-surface-border bg-surface hover:border-zinc-700 transition space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2.5 py-0.5 rounded-full font-medium">
                    {community.name}
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
                  <span className="text-brand group-hover:underline">Read blog →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}