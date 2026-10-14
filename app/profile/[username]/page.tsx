import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Community from "@/models/Community";
import { getPosts } from "@/lib/queries";
import { auth } from "@/auth";
import { ProfilePageProps } from "@/types/profile";

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  await connectToDatabase();
  const session = await auth();
  const user = await User.findOne({$or: [{ username: username }, { name: { $regex: new RegExp(`^${username}$`, "i") } }]}).lean();
  if (!user) {
    notFound();
  }
  const communities = await Community.find({ members: user._id }).lean();
  const { posts } = await getPosts({
    authorId: user._id.toString(),
    limit: 20,
  });
  const isOwnProfile =
    session?.user?.id === user._id.toString() ||
    session?.user?.username === user.username;
  return (
    <div className="space-y-8 max-w-5xl mx-auto text-zinc-100">
      <div className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img src={user.image} alt={user.name || user.username} className="w-20 h-20 rounded-full border-2 border-brand object-cover"/>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-brand bg-zinc-800 flex items-center justify-center text-2xl font-bold text-brand">
                {(user.name || user.username || "D").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {user.name || user.username}
              </h1>
              <p className="text-sm text-brand font-medium">@{user.username}</p>
              <p className="text-xs text-zinc-500 mt-1">
                Joined{" "}
                {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {isOwnProfile && (
            <Link href="/settings" className="self-start md:self-auto px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-200 hover:text-white hover:border-zinc-500 transition">
              Edit Profile
            </Link>
          )}
        </div>
        {user.bio ? (
          <p className="text-sm text-zinc-300 leading-relaxed">{user.bio}</p>
        ) : (
          <p className="text-xs text-zinc-500 italic">No bio provided yet.</p>
        )}
        {user.skills && user.skills.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Skills & Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string) => (
                <span key={skill} className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            Published Blogs
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-700">
              {posts.length}
            </span>
          </h2>
          {posts.length === 0 ? (
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950 text-center text-xs text-zinc-500">
              No blogs published yet.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <Link key={post._id} href={`/blogs/${post.slug}`} className="group block p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-2 py-0.5 rounded-full text-[11px] font-medium">
                      {post.community?.name || "General"}
                    </span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {month: "short", day: "numeric"})}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand transition">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            Joined Communities
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-700">
              {communities.length}
            </span>
          </h2>
          {communities.length === 0 ? (
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950 text-center text-xs text-zinc-500">
              Not a member of any communities yet.
            </div>
          ) : (
            <div className="space-y-3">
              {communities.map((community: any) => (
                <Link key={community._id.toString()} href={`/communities/${community.slug}`} className="group flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand transition">
                      {community.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {community.description}
                    </p>
                  </div>
                  <span className="text-xs text-brand group-hover:underline">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}