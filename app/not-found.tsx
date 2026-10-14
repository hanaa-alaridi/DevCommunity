import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
      <div className="space-y-2 max-w-md">
        <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-brand">
          404 Error
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The blog post, community, or resource you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Link href="/blogs" className="px-4 py-2.5 rounded-lg bg-brand text-xs font-semibold text-black hover:bg-brand-hover transition">
          Explore Blogs
        </Link>
        <Link href="/" className="px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition">
          Return Home
        </Link>
      </div>
    </div>
  );
}
