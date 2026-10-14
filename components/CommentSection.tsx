"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommentSectionProps, CommentItem } from "@/types/comments";
import LikeButton from "./LikeButton";

export default function CommentSection({postId, postAuthorId, comments = [], currentUserId, isLoggedIn,}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  async function handleAddComment(e: React.SubmitEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    if (!isLoggedIn) {
      router.push("/signIn");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to post comment.");
        return;
      }
      setContent("");
      router.refresh();
    } 
    catch {
      setError("An unexpected error occurred. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }
  async function handleDeleteComment(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(
        `/api/posts/${postId}/comments?commentId=${commentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete comment.");
        return;
      }
      router.refresh();
    } 
    catch {
      alert("Error deleting comment.");
    } 
    finally {
      setDeletingId(null);
    }
  }
  return (
    <section className="space-y-6 pt-6 border-t border-surface-border">
      <h3 className="text-xl font-bold text-white">
        Comments ({comments.length})
      </h3>
      {isLoggedIn ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
              {error}
            </div>
          )}
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts or answer a question..." rows={3} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-brand focus:outline-none"/>
          <div className="flex justify-end">
            <button type="submit" disabled={loading || !content.trim()} className="px-4 py-2 rounded-lg bg-brand text-xs font-semibold text-black hover:bg-brand-hover transition disabled:opacity-50">
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-center text-xs text-zinc-400">
          Please{" "}
          <Link href="/signIn" className="text-brand font-semibold hover:underline">
            sign in
          </Link>{" "}
          to leave a comment.
        </div>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-2">
            No comments yet. Be the first to start the discussion!
          </p>
        ) : (
          comments.map((comment) => {
            const authorObj =
              typeof comment.author === "object" ? comment.author : null;
            const authorName = authorObj?.username || "developer";
            const authorImage = authorObj?.image;
            const authorId =
              authorObj?._id?.toString() ||
              (typeof comment.author === "string" ? comment.author : "");
            const isCommentOwner = Boolean(currentUserId) && currentUserId === authorId;
            const isPostOwner = Boolean(currentUserId) && currentUserId === postAuthorId;
            const canDelete = isCommentOwner || isPostOwner;
            return (
              <div key={comment._id} className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${authorName}`} className="shrink-0 flex items-center gap-2 group">
                      {authorImage ? (
                        <img src={authorImage} alt={authorName} className="w-6 h-6 rounded-full border border-zinc-700 object-cover shrink-0 group-hover:border-brand transition"/>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-[10px] text-brand shrink-0 group-hover:border-brand transition">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-semibold text-zinc-200 group-hover:text-brand transition">
                        @{authorName}
                      </span>
                    </Link>
                    <span className="text-[10px] text-zinc-500">•</span>
                    <time className="text-[10px] text-zinc-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}
                    </time>
                  </div>
                  {canDelete && (
                    <button onClick={() => handleDeleteComment(comment._id)} disabled={deletingId === comment._id} className="text-[11px] text-red-400 hover:text-red-300 hover:underline disabled:opacity-50">
                      {deletingId === comment._id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
                <p className="text-zinc-300 leading-relaxed text-sm pt-1 whitespace-pre-line">
                  {comment.content}
                </p>
                <LikeButton endpoint={`/api/posts/${postId}/comments/${comment._id}/like`} initialLikesCount={comment.likesCount || 0} initialHasLiked={Boolean(comment.hasLiked)} isLoggedIn={isLoggedIn}/>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}