"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialAuthButtons from "./SocialAuthButtons";
import { getLastUser, setLastUser, clearLastUser } from "@/lib/lastUserCookie";

export default function LoginForm() {
  const router = useRouter();
  const [lastUser, setLastUserState] = useState<{ name: string; email: string } | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cookie is only readable client-side; setting state here (post-hydration) avoids an SSR/client mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const cached = getLastUser();
    setLastUserState(cached);
    if (cached) setEmail(cached.email);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    setLastUser(data.name, email);
    router.push("/dashboard");
    router.refresh();
  }

  function useAnotherAccount() {
    clearLastUser();
    setLastUserState(null);
    setEmail("");
    setPassword("");
  }

  if (lastUser === undefined) {
    return <div className="mx-auto h-64 w-full max-w-sm" />;
  }

  if (lastUser) {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple text-xl font-semibold text-white">
          {lastUser.name.charAt(0)}
        </span>
        <h2 className="mt-4 text-lg font-bold text-brand-ink">Welcome back, {lastUser.name.split(" ")[0]}!</h2>
        <p className="mt-1 text-sm text-brand-muted">{lastUser.email}</p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 text-left">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Password</label>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
            />
          </div>
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <button type="button" onClick={useAnotherAccount} className="mt-4 text-sm font-semibold text-brand-pink hover:underline">
          Sign in using another account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <SocialAuthButtons />
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-brand-border" />
        <span className="text-xs font-medium text-brand-muted">OR</span>
        <span className="h-px flex-1 bg-brand-border" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
        <p className="text-center text-sm text-brand-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-pink hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
