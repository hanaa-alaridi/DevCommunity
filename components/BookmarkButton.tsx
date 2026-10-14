"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarkButtonProps } from "@/types/bookmarks";

export default function BookmarkButton({postId, initialIsBookmarked, isLoggedIn,}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleToggleBookmark() {
    if (!isLoggedIn) {
      router.push("/signIn");
      return;
    }
    setLoading(true);
    try {
      const method = isBookmarked ? "DELETE" : "POST";
      const res = await fetch(`/api/posts/${postId}/bookmark`, { method });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update bookmark.");
        return;
      }
      setIsBookmarked(!isBookmarked);
      router.refresh();
    } 
    catch {
      alert("Something went wrong. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={handleToggleBookmark} disabled={loading} aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"} className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${isBookmarked ? "bg-brand/10 border-brand/30 text-brand" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    </button>
  );
}