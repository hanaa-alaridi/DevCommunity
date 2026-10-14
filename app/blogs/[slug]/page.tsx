import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { auth } from "@/auth";
import DeletePostButton from "@/components/DeletePostButton";
import CommentSection from "@/components/CommentSection";
import Bookmark from "@/models/Bookmark";
import { connectToDatabase } from "@/lib/db";
import BookmarkButton from "@/components/BookmarkButton";
import LikeButton from "@/components/LikeButton";
import User from "@/models/User";
import { BlogPostPageProps } from "@/types/blogs";

export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const session = await auth();
  let isBookmarked = false;
  if (session?.user?.id) {
    await connectToDatabase();
    const existingBookmark = await Bookmark.findOne({
      user: session.user.id,
      post: post._id,
    });
    isBookmarked = Boolean(existingBookmark);
  }
  const authorId = post.author?._id?.toString() || post.author?.id || post.author?.toString();
  const isAuthor = Boolean(session?.user?.id && session.user.id === authorId);
  let currentUserIdStr = "";
  if (session?.user) {
    await connectToDatabase();
    const dbUser = await User.findOne({
      $or: [
        session.user.id ? { _id: session.user.id } : null,
        session.user.email ? { email: session.user.email } : null,
      ].filter(Boolean) as any[]}).lean();
    if (dbUser) {
      currentUserIdStr = dbUser._id.toString();
    }
  }
  const postLikes = Array.isArray(post.likes) ? post.likes.filter(Boolean).map((id: any) => (id._id ? id._id.toString() : id.toString())) : [];
  const initialLikesCount = postLikes.length;
  const initialHasLiked = Boolean(currentUserIdStr && postLikes.includes(currentUserIdStr));
  const comments = (post.comments || []).map((c: any) => {
    const isObjectAuthor = typeof c.author === "object" && c.author !== null;
    const commentLikes = Array.isArray(c.likes) ? c.likes.filter(Boolean).map((id: any) =>
      (id._id ? id._id.toString() : id.toString())) : [];
    return {
      _id: c._id?.toString() || c._id,
      content: c.content,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
      likesCount: commentLikes.length,
      hasLiked: Boolean(currentUserIdStr && commentLikes.includes(currentUserIdStr)),
      author: {
        _id: isObjectAuthor ? c.author._id?.toString() || c.author.id : typeof c.author === "string" ? c.author : "",
        username: isObjectAuthor ? c.author.username || c.author.name || "developer" : "developer",
        image: isObjectAuthor ? c.author.image || "" : "",
      }
    };
  });
  return (
    <article className="space-y-8 max-w-4xl mx-auto text-zinc-100">
      <div className="flex items-center justify-between">
        <Link href="/blogs" className="inline-flex items-center text-xs text-zinc-400 hover:text-brand transition">
          ← Back to All Blogs
        </Link>   
        {isAuthor && (
          <div className="flex items-center gap-3">
            <Link href={`/blogs/${post.slug}/edit`} className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition">
              Edit Post
            </Link>
            <DeletePostButton postId={post._id.toString()} />
          </div>
        )}  
      </div>  
      <header className="rounded-2xl bg-surface border border-surface-border p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          {post.community ? (
            <Link href={`/communities/${post.community.slug}`} className="bg-emerald-950/60 text-brand border border-emerald-800/30 px-3 py-1 rounded-full font-medium hover:underline">
              {post.community.name}
            </Link>
          ) : (
            <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-medium">
              General
            </span>
          )}
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}
          </time>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-between pt-4 border-t border-surface-border text-xs text-zinc-400">
          <Link href={`/profile/${post.author?.username || "developer"}`} className="flex items-center gap-2.5 group hover:text-brand transition">
            {post.author?.image ? (
              <img src={post.author.image} alt={post.author.username || "Author"} className="w-9 h-9 rounded-full border border-zinc-700 object-cover group-hover:border-brand transition shrink-0"/>
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-brand group-hover:border-brand transition shrink-0 text-xs">
                {(post.author?.username || "D").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span className="font-semibold text-white group-hover:text-brand block">
                @{post.author?.username || "developer"}
              </span>
              <span className="text-[11px] text-zinc-500">Author</span>
            </div>
          </Link>
          {post.topics && post.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.topics.map((topic: string) => (
                <Link key={topic} href={`/blogs?topic=${topic}`} className="bg-zinc-800/80 text-brand hover:underline px-2.5 py-0.5 rounded text-[11px] border border-zinc-700/50">
                  #{topic}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      <section className="bg-surface/50 rounded-2xl border border-surface-border p-6 md:p-10 text-zinc-300 leading-relaxed space-y-6 text-base md:text-lg">
        {post.content.split("\n\n").map((paragraph: string, index: number) => (
          <p key={index} className="whitespace-pre-line">{paragraph}</p>
        ))}
      </section>
      <div className="flex justify-between gap-2">
        <LikeButton postId={post._id.toString()} initialLikesCount={initialLikesCount} initialHasLiked={initialHasLiked} isLoggedIn={Boolean(session?.user)}/>
        <BookmarkButton postId={post._id.toString()} initialIsBookmarked={isBookmarked} isLoggedIn={Boolean(session?.user)}/>
      </div>
      <CommentSection postId={post._id.toString()} postAuthorId={authorId} comments={comments} currentUserId={session?.user?.id} isLoggedIn={Boolean(session?.user)}/>
      <footer className="flex items-center justify-between pt-6 border-t border-surface-border text-xs text-zinc-400">
        <Link href="/blogs" className="text-brand hover:underline font-medium inline-flex items-center gap-1">
          ← Explore more articles
        </Link>
      </footer>
    </article>
  );
}