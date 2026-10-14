"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeletePostButtonProps } from "@/types/posts";

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete post.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } 
    catch {
      alert("An unexpected error occurred. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={handleDelete} disabled={loading} className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20 transition disabled:opacity-50">
      {loading ? "Deleting..." : "Delete Post"}
    </button>
  );
}