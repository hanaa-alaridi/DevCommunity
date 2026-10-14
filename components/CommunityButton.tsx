"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JoinCommunityButtonProps } from "@/types/communities";

export default function JoinCommunityButton({communityId, initialIsMember, isLoggedIn}: JoinCommunityButtonProps) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleToggleJoin() {
    if (!isLoggedIn) {
      router.push("/signIn");
      return;
    }
    setLoading(true);
    try {
      const method = isMember ? "DELETE" : "POST";
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Something went wrong.");
        return;
      }
      setIsMember(!isMember);
      router.refresh();
    } 
    catch {
      alert("Failed to update membership. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={handleToggleJoin} disabled={loading} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 ${isMember ? "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400" : "bg-brand text-black hover:bg-brand-hover shadow-lg shadow-brand/10"}`}>
      {loading ? "Updating..." : isMember ? "Joined" : "Join Community"}
    </button>
  );
}