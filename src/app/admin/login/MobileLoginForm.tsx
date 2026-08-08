"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mobile-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push(params.get("next") ?? "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col justify-end px-5 pb-10 pt-16"
      style={{ background: "linear-gradient(180deg, var(--color-brand-purple) 0%, #1a0930 100%)" }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <Image src="/logo.svg" alt="Academy" width={281} height={98} className="h-10 w-auto" priority />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Academy Admin</h1>
          <p className="mt-1 text-sm text-white/60">Mobile Access</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <Mail size={18} className="shrink-0 text-white/50" />
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Lock size={18} className="shrink-0 text-white/50" />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="shrink-0 text-white/50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="px-1 text-sm font-medium text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[15px] font-semibold text-brand-purple active:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <p className="mt-2 text-center text-xs text-white/40">
          Mobile access only — this login is separate from the desktop admin.
        </p>
      </form>
    </div>
  );
}

export default function MobileLoginForm() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
