"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LikeButtonProps } from "@/types/likes";

export default function LikeButton({postId, endpoint, initialLikesCount, initialHasLiked, isLoggedIn}: LikeButtonProps) {
  const targetEndpoint = endpoint || `/api/posts/${postId}/like`;
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [loading, setLoading] = useState(false);
  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      router.push("/signIn");
      return;
    }
    if (loading) return;
    setLoading(true);
    const prevCount = likesCount;
    const prevLiked = hasLiked;
    setHasLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const res = await fetch(targetEndpoint, {method: "POST", headers: { "Content-Type": "application/json"}});
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Like API Error (${res.status}):`, errorText);
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      setHasLiked(data.liked);
      setLikesCount(data.likesCount);
    } 
    catch (err) {
      console.error("Failed to like post:", err);
      setHasLiked(prevLiked);
      setLikesCount(prevCount);
    } 
    finally {
      setLoading(false);
    }
  };
  return (
    <button onClick={handleToggleLike} disabled={loading} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${ hasLiked ? "bg-brand/10 border-brand/30 text-brand" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" className={`w-4 h-4 transition-all duration-200 ${hasLiked ? "fill-brand stroke-brand text-brand scale-110" : "fill-none stroke-current text-zinc-400 group-hover:text-white"}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
      </svg>
      <span>{likesCount}</span>
    </button>
  );
}