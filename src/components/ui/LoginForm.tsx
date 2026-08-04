"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, X, ChevronDown } from "lucide-react";
import SocialAuthButtons from "./SocialAuthButtons";
import { getLastUser, setLastUser, clearLastUser } from "@/lib/lastUserCookie";

function ModalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-brand-muted hover:bg-brand-surface hover:text-brand-ink"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center px-8 pb-2 pt-9 text-center">
          <Image src="/logo.svg" alt="Academy" width={281} height={98} className="h-12 w-auto" priority />
          <p className="mt-4 text-lg text-brand-muted">Unlimited access to our resources</p>
        </div>

        {children}

        <div className="flex items-center justify-center gap-1 border-t border-brand-border px-8 py-4 text-sm text-brand-muted">
          English (United States)
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [lastUser, setLastUserState] = useState<{ name: string; email: string } | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

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
    return <ModalShell><div className="h-72" /></ModalShell>;
  }

  const canSubmit = email.trim() && password;

  return (
    <ModalShell>
      <div className="grid grid-cols-1 gap-8 px-8 pb-8 pt-6 sm:grid-cols-2 sm:divide-x sm:divide-brand-border">
        <div className="sm:pr-8">
          <h3 className="mb-4 text-lg font-bold text-brand-ink">Sign up</h3>
          <div className="flex flex-col gap-3">
            <SocialAuthButtons />
            <Link
              href="/signup"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
            >
              <Mail size={16} /> Sign up with email
            </Link>
          </div>
          <p className="mt-4 text-xs text-brand-muted">
            By signing up, you agree to the{" "}
            <Link href="/terms" className="font-semibold text-brand-ink underline hover:text-brand-pink">
              Terms of Service
            </Link>{" "}
            and acknowledge you&apos;ve read our{" "}
            <Link href="/privacy-policy" className="font-semibold text-brand-ink underline hover:text-brand-pink">
              Privacy Policy.
            </Link>
          </p>
        </div>

        <div className="sm:pl-8">
          <h3 className="mb-4 text-lg font-bold text-brand-ink">Log in</h3>

          {lastUser ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple text-lg font-semibold text-white">
                {lastUser.name.charAt(0)}
              </span>
              <p className="mt-2 text-sm font-semibold text-brand-ink">Welcome back, {lastUser.name.split(" ")[0]}!</p>
              <p className="text-xs text-brand-muted">{lastUser.email}</p>

              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-left">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-ink">Password</label>
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
                  className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
                >
                  {submitting ? "Logging in..." : "Log in"}
                </button>
              </form>
              <button type="button" onClick={useAnotherAccount} className="mt-3 text-xs font-semibold text-brand-pink hover:underline">
                Sign in using another account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-ink">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-brand-ink">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex items-center gap-1 text-xs font-medium text-brand-muted hover:text-brand-ink"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotNotice(true)}
                  className="text-xs font-semibold text-brand-ink underline hover:text-brand-pink"
                >
                  Forget your password
                </button>
              </div>
              {forgotNotice && (
                <p className="-mt-2 text-xs text-brand-muted">
                  Password reset isn&apos;t set up yet —{" "}
                  <Link href="/contact" className="font-semibold text-brand-pink hover:underline">
                    contact us
                  </Link>{" "}
                  and we&apos;ll help you back in.
                </p>
              )}

              {error && <p className="text-xs font-medium text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                  canSubmit ? "bg-brand-pink text-white hover:bg-brand-pink-dark" : "bg-brand-border text-brand-muted"
                } disabled:cursor-not-allowed`}
              >
                {submitting ? "Logging in..." : "Log in"}
              </button>
            </form>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
