"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardClientProps } from "@/types/dashboard";

export default function DashboardClient({user, stats, initialPosts, initialComments, initialCreatedCommunities, initialJoinedCommunities, initialBookmarks}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "createdCommunities" | "joinedCommunities" | "bookmarks">("posts");
  const [commentsList, setCommentsList] = useState(initialComments);
  const [postsList, setPostsList] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {method: "DELETE"});
      if (res.ok) {
        setCommentsList((prev) => prev.filter((c) => c._id !== commentId));
        router.refresh();
      } 
      else {
        alert("Failed to delete comment");
      }
    } 
    catch (err) {
      console.error(err);
      alert("An error occurred while deleting comment");
    } 
    finally {
      setDeletingId(null);
    }
  };
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/blogs/${postId}`, {method: "DELETE"});
      if (res.ok) {
        setPostsList((prev) => prev.filter((p) => p._id !== postId));
        router.refresh();
      } 
      else {
        alert("Failed to delete post");
      }
    } 
    catch (err) {
      console.error(err);
      alert("An error occurred while deleting post");
    } 
    finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="max-w-6xl mx-auto space-y-8 text-zinc-100 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img src={user.image} alt={user.username} className="w-14 h-14 rounded-full border-2 border-brand object-cover shrink-0"/>
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-brand bg-zinc-800 flex items-center justify-center font-bold text-brand text-xl shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.username} 👋
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage your published blogs, track comments, and monitor engagement.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/create" className="px-4 py-2 rounded-lg bg-brand text-xs font-bold text-black hover:bg-brand-hover transition">
            + New Post
          </Link>
          <Link href="/communities/create" className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition">
            + New Community
          </Link>
          <Link href="/settings" className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition">
            ⚙️ Settings
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Published Posts</p>
          <p className="text-2xl font-black text-white">{postsList.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Comments Posted</p>
          <p className="text-2xl font-black text-brand">{commentsList.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Likes on Posts</p>
          <p className="text-2xl font-black text-white">{stats.totalLikes}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Created Communities</p>
          <p className="text-2xl font-black text-brand">{stats.totalCreatedCommunities}</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Joined Communities</p>
          <p className="text-2xl font-black text-white">{stats.totalJoinedCommunities}</p>
        </div>
      </div>
      <div className="border-b border-zinc-800 flex gap-6 text-sm font-medium">
        <button onClick={() => setActiveTab("posts")} className={`pb-3 transition relative ${activeTab === "posts" ? "text-brand border-b-2 border-brand font-bold" : "text-zinc-400 hover:text-white"}`}>
          My Posts ({postsList.length})
        </button>
        <button onClick={() => setActiveTab("comments")} className={`pb-3 transition relative ${activeTab === "comments" ? "text-brand border-b-2 border-brand font-bold" : "text-zinc-400 hover:text-white"}`}>
          My Comments ({commentsList.length})
        </button>
        <button onClick={() => setActiveTab("createdCommunities")} className={`pb-3 transition relative shrink-0 ${activeTab === "createdCommunities" ? "text-brand border-b-2 border-brand font-bold" : "text-zinc-400 hover:text-white"}`}>
          Created Communities ({initialCreatedCommunities.length})
        </button>
        <button onClick={() => setActiveTab("joinedCommunities")} className={`pb-3 transition relative shrink-0 ${activeTab === "joinedCommunities" ? "text-brand border-b-2 border-brand font-bold" : "text-zinc-400 hover:text-white"}`}>
          Joined Communities ({initialJoinedCommunities.length})
        </button>    
        <button onClick={() => setActiveTab("bookmarks")} className={`pb-3 transition relative ${activeTab === "bookmarks" ? "text-brand border-b-2 border-brand font-bold" : "text-zinc-400 hover:text-white"}`}>
          Bookmarks ({initialBookmarks.length})
        </button>
      </div>
      <div className="space-y-4">
        {activeTab === "posts" && (
          <div className="space-y-3">
            {postsList.length === 0 ? (
              <div className="text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-400">You haven't written any blog posts yet.</p>
                <Link href="/create-post" className="inline-block px-4 py-2 rounded-lg bg-brand text-xs font-bold text-black hover:bg-brand-hover transition">
                  Write Your First Post
                </Link>
              </div>
            ) : (
              postsList.map((post) => (
                <div key={post._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {post.community && (
                        <span className="text-[10px] bg-emerald-950/60 text-brand border border-emerald-800/30 px-2 py-0.5 rounded font-medium">
                          {post.community.name}
                        </span>
                      )}
                      <time className="text-[11px] text-zinc-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}
                      </time>
                    </div>
                    <Link href={`/blogs/${post.slug}`} className="font-bold text-white hover:text-brand transition text-base block truncate">
                      {post.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                      ❤️ {post.likes?.length || 0}
                    </span>
                    <Link href={`/blogs/${post.slug}`} className="text-zinc-300 hover:text-white font-medium">
                      View
                    </Link>
                    <Link href={`/blogs/${post.slug}/edit`} className="text-brand hover:underline font-medium">
                      Edit
                    </Link>
                    <button onClick={() => handleDeletePost(post._id)} disabled={deletingId === post._id} className="text-red-400 hover:text-red-300 hover:underline font-medium disabled:opacity-50">
                      {deletingId === post._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "comments" && (
          <div className="space-y-3">
            {commentsList.length === 0 ? (
              <div className="text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-400">You haven't posted any comments yet.</p>
                <Link href="/blogs" className="text-xs text-brand font-bold hover:underline">
                  Browse Blogs & Join Discussions →
                </Link>
              </div>
            ) : (
              commentsList.map((comment) => (
                <div key={comment._id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>Commented on</span>
                      {comment.postId ? (
                        <Link href={`/blogs/${comment.postId.slug}`} className="font-bold text-brand hover:underline truncate">
                          "{comment.postId.title}"
                        </Link>
                      ) : (
                        <span className="italic text-zinc-500">[Deleted Post]</span>
                      )}
                    </div>
                    <time className="text-[10px] text-zinc-500 shrink-0">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}
                    </time>
                  </div>
                  <p className="text-zinc-200 text-sm whitespace-pre-line leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/50">
                    {comment.content}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                      ❤️ {comment.likesCount || 0}{" "}
                    </span>                
                    <button onClick={() => handleDeleteComment(comment._id)} disabled={deletingId === comment._id} className="text-red-400 hover:text-red-300 hover:underline text-xs disabled:opacity-50">
                      {deletingId === comment._id ? "Deleting..." : "Delete Comment"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "createdCommunities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialCreatedCommunities.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-400">You haven't created any communities yet.</p>
                <Link href="/communities" className="text-xs text-brand font-bold hover:underline">
                  Explore or Create Developer Communities →
                </Link>
              </div>
            ) : (
              initialCreatedCommunities.map((community) => (
                <div key={community._id} className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">{community.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{community.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs">
                    <span className="text-zinc-500">
                      👥 {community.members?.length || 1} members
                    </span>
                    <Link href={`/communities/${community.slug}`} className="text-brand font-bold hover:underline">
                      View Community →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "joinedCommunities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialJoinedCommunities.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-400">You haven't joined any communities yet.</p>
                <Link href="/communities" className="text-xs text-brand font-bold hover:underline">
                  Explore Developer Communities →
                </Link>
              </div>
            ) : (
              initialJoinedCommunities.map((community) => (
                <div key={community._id} className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">{community.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{community.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs">
                    <span className="text-zinc-500">
                      👥 {community.members?.length || 1} members
                    </span>
                    <Link href={`/communities/${community.slug}`} className="text-brand font-bold hover:underline">
                      View Community →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "bookmarks" && (
          <div className="space-y-3">
            {initialBookmarks.length === 0 ? (
              <div className="text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-400">You have no saved bookmarks.</p>
                <Link href="/blogs" className="text-xs text-brand font-bold hover:underline">
                  Discover Articles to Bookmark →
                </Link>
              </div>
            ) : (
              initialBookmarks.map((post) => (
                <div key={post._id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] text-zinc-500">
                      by @{post.author?.username || "developer"}
                    </span>
                    <Link href={`/blogs/${post.slug}`} className="font-bold text-white hover:text-brand transition text-base block truncate">
                      {post.title}
                    </Link>
                  </div>
                  <Link href={`/blogs/${post.slug}`} className="text-xs text-brand font-bold hover:underline shrink-0">
                    Read Post →
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}