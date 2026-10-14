"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { userProfileSchema } from "@/schemas/userSchema";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const result = userProfileSchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/signUp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });  
      const responseData = await res.json();
      if (!res.ok) {
        setError(responseData.message || "Failed to create account.");
        return;
      }
      const signInRes = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (signInRes?.error) {
        router.push("/signIn");
      } 
      else if (signInRes?.url) {
        window.location.href = signInRes.url;
      }
    }
    catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
    finally {
      setLoading(false);
    }
  }
  return(
    <div className="flex min-h-[85vh] items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md space-y-6 border rounded-2xl border-zinc-800 bg-zinc-900 p-8 shadow-xl backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create An Account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join DevCommunity to share posts, discover developers, and collaborate.
          </p>
        </div>
        {error && (
          <p className="border rounded-lg border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-500">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Username
            </label>
            <input name="username" type="text" className="w-full border rounded-lg border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-brand"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Email Address
            </label>
            <input name="email" type="email" placeholder="developer@gmail.com" className="w-full border rounded-lg border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-brand placeholder-zinc-500"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input name="password" type="password" className="w-full border rounded-lg border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-brand"/>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand rounded-lg py-2.5 text-sm text-black font-semibold transition hover:bg-brand-hover disabled:opacity-50">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-zinc-500"></div>
          <span className="absolute bg-zinc-900 px-3 text-xs text-zinc-500">
            OR
          </span>
        </div>
        <div className="mt-8 space-y-4">
          <button type="button" onClick={() => signIn("github", { callbackUrl: "/dashboard" })} className="flex w-full items-center justify-center gap-3 border rounded-lg border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 hover:border-zinc-600 focus:outline-none">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with Github
          </button>
          <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="flex w-full items-center justify-center gap-3 border rounded-lg border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 hover:border-zinc-600 focus:outline-none">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/signIn" className="font-semibold text-brand hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}