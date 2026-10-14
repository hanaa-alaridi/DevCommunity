"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { communitySchema } from "@/schemas/communitySchema";
import TopicSelector from "@/components/TopicSelector";
import { CreateCommunityFormProps } from "@/types/communities";

export default function CreateCommunityForm({availableTopics} : CreateCommunityFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      topics: selectedTopics,
    };
    const result = communitySchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Validation error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const responseData = await res.json();
      if (!res.ok) {
        setError(responseData.message || "Failed to create community.");
        return;
      }
      router.push(`/communities/${responseData.community.slug}`);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Create a New Community</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Establish a new technical ecosystem for developers to share insights.
        </p>
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Community Name
            </label>
            <input name="name" type="text" className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 focus:border-brand focus:outline-none"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea name="description" rows={4} placeholder="What is this community about?" className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-brand focus:outline-none"/>
          </div>
          <TopicSelector availableTopics={availableTopics} selectedTopics={selectedTopics} onChange={setSelectedTopics}/>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-black transition hover:bg-brand-hover disabled:opacity-50">
            {loading ? "Creating Community..." : "Create Community"}
          </button>
        </form>
      </div>
    </div>
  );
}