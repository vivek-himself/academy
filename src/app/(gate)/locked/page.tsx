"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function LockedPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/site-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }
    // Same URL is still in the address bar (proxy rewrote the response, not the URL) —
    // reloading it now passes the fresh unlock cookie and lets the real page through.
    window.location.reload();
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <Image src="/logo.svg" alt="Academy" width={281} height={98} className="h-12 w-auto brightness-0 invert" priority />
      <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
        <Lock size={20} />
      </span>
      <h1 className="mt-4 text-2xl font-bold">This site is password protected</h1>
      <p className="mt-2 text-sm text-white/70">Enter the password to continue.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-3">
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-sm text-white outline-none placeholder:text-white/50 focus:border-white/50"
        />
        {error && <p className="text-xs font-medium text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-purple hover:bg-white/90 disabled:opacity-60"
        >
          {submitting ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
