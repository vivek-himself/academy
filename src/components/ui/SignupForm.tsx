"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink">Full Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
        />
      </div>
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
        />
        <p className="mt-1 text-xs text-brand-muted">At least 8 characters.</p>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
      >
        {submitting ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-center text-sm text-brand-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-pink hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
