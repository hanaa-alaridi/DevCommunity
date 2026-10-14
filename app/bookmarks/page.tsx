import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";
import "@/models/Post";
import "@/models/User";
import "@/models/Community";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/signIn");
  }
  await connectToDatabase();
  const bookmarkDocs = await Bookmark.find({ user: session.user.id })
    .populate({
      path: "post",
      populate: [
        { path: "community", select: "name slug" },
        { path: "author", select: "username name image" },
      ],
    })
    .sort({ savedAt: -1 })
    .lean();
  const savedPosts = bookmarkDocs
    .map((doc) => doc.post)
    .filter(Boolean);
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Saved Bookmarks</h1>
        <p className="text-xs text-zinc-400">
          Access all your bookmarked technical posts for quick reference.
        </p>
      </div>
      {savedPosts.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center space-y-3">
          <p className="text-sm text-zinc-400">You haven't bookmarked any posts yet.</p>
          <Link href="/blogs" className="inline-block px-4 py-2 rounded-lg bg-brand text-xs font-semibold text-black hover:bg-brand-hover transition">
            Explore Blogs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedPosts.map((post: any) => (
            <div key={post._id.toString()} className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-start justify-between gap-4 hover:border-zinc-700 transition">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-semibold text-brand">
                    c/{post.community?.name || "dev"}
                  </span>
                  <span>•</span>
                  <span>@{post.author?.username || "developer"}</span>
                </div>
                <Link href={`/blogs/${post.slug}`} className="text-base font-bold text-white hover:text-brand transition line-clamp-1">
                  {post.title}
                </Link>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {post.content}
                </p>
                {post.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.topics.map((topic: string) => (
                      <span key={topic} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <BookmarkButton postId={post._id.toString()} initialIsBookmarked={true} isLoggedIn={true}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
