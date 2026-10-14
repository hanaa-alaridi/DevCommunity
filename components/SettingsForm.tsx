"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SettingsFormProps } from "@/types/settings";

export default function SettingsForm({ initialUser }: SettingsFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUser.username);
  const [bio, setBio] = useState(initialUser.bio);
  const [skills, setSkills] = useState(initialUser.skills);
  const [image, setImage] = useState(initialUser.image);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, skills, image }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } 
    catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" });
    } 
    finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
      {message && (
        <div className={`p-4 rounded-xl text-sm border ${message.type === "success" ? "bg-emerald-950/60 border-emerald-800/50 text-emerald-300" : "bg-red-950/60 border-red-800/50 text-red-300"}`}>
          {message.text}
        </div>
      )}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">
          Username
        </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand"/>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">
          Bio
        </label>
        <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Full-stack engineer building modern web apps..." className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand resize-none"/>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">
          Tech Stack (comma-separated)
        </label>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Next.js, TypeScript, MongoDB, TailwindCSS" className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand"/>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">
          Profile Image URL
        </label>
        <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-brand"/>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
        <Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition font-medium">
          ← View Profile
        </Link>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-brand text-xs font-bold text-black hover:bg-brand-hover transition disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}