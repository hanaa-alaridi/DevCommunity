"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postSchema } from "@/schemas/postSchema";
import { EditPostFormProps } from "@/types/posts";
import TopicSelector from "@/components/TopicSelector";

export default function EditPostForm({post, communities, availableTopics}: EditPostFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(post.topics || []);
  const router = useRouter();
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      community: formData.get("community") as string,
      content: formData.get("content") as string,
      topics: selectedTopics,
    };
    const result = postSchema.partial().safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Validation error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const responseData = await res.json();
      if (!res.ok) {
        setError(responseData.message || "Failed to update post.");
        return;
      }
      router.push(`/blogs/${responseData.post.slug || post.slug}`);
      router.refresh();
    } 
    catch {
      setError("An unexpected error occurred. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Post</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Update your post details below.
        </p>
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Title
            </label>
            <input name="title" type="text" defaultValue={post.title} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-brand focus:outline-none"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Community
            </label>
            <select name="community" defaultValue={post.community} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 focus:border-brand focus:outline-none">
              <option value="">
                -- Choose a community --
              </option>
              {communities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <TopicSelector availableTopics={availableTopics} selectedTopics={selectedTopics} onChange={setSelectedTopics}/>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Content
            </label>
            <textarea name="content" rows={8} defaultValue={post.content} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-brand focus:outline-none"/>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-black transition hover:bg-brand-hover disabled:opacity-50">
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}