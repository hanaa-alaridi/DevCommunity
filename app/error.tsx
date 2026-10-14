"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({error, reset}: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => {
    console.error("Unhandled runtime error:", error);
  }, [error]);
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
      <div className="space-y-2 max-w-md">
        <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
          Something went wrong
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Application Error
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          An unexpected error occurred while loading this page. You can try re-executing the request or return to the main feed.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => reset()} className="px-4 py-2.5 rounded-lg bg-brand text-xs font-semibold text-black hover:bg-brand-hover transition">
          Try Again
        </button>
        <Link href="/" className="px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition">
          Return Home
        </Link>
      </div>
    </div>
  );
}