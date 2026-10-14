"use client"

import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const logoHref = session?.user ? "/dashboard" : "/signIn";
  const isAuthPage = pathname === "/signIn" || pathname === "/signUp";
  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };
  return (
    <header className="h-16 border-b border-surface-border bg-black px-3 sm:px-6 pl-12 sm:pl-6 flex items-center justify-between gap-2">
      <nav className="relative flex-1 max-w-[180px] sm:max-w-md">
        <form onSubmit={handleSearch}>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search communities, blogs, and people" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand"/>
        </form>
      </nav>
      <nav className="flex items-center gap-4">
        {status === "loading" ? (
           <div className="h-8 w-20 animate-pulse rounded bg-zinc-800"/>
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img src={session.user.image} alt={session.user.name || "User avatar"} className="h-8 w-8 rounded-full border border-zinc-700 object-cover"/>
            )}
            <span className="hidden sm:inline text-sm font-medium text-zinc-300">
              {session.user.username || session.user.name}
            </span>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors">
              Sign Out
            </button>
          </div>
        ) : isAuthPage ? null : (
          <Link href="/signIn" className="bg-brand text-sm text-black font-semibold px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors">
            Sign In
          </Link>
        )}   
      </nav>
    </header>
  );
}
