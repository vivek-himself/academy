"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Delete } from "lucide-react";

const PIN_LENGTH = 6;

function PinDots({ length, filled }: { length: number; filled: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <span key={i} className={`h-3.5 w-3.5 rounded-full border border-white/40 ${i < filled ? "bg-white" : "bg-transparent"}`} />
      ))}
    </div>
  );
}

function Keypad({ onDigit, onBackspace }: { onDigit: (d: string) => void; onBackspace: () => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"];
  return (
    <div className="mx-auto grid w-full max-w-[280px] grid-cols-3 gap-3">
      {keys.map((k, i) => {
        if (k === "") return <div key={i} />;
        if (k === "backspace") {
          return (
            <button
              key={i}
              type="button"
              onClick={onBackspace}
              aria-label="Backspace"
              className="flex h-16 w-16 items-center justify-center justify-self-center rounded-full text-white/70 active:bg-white/10"
            >
              <Delete size={22} />
            </button>
          );
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onDigit(k)}
            className="flex h-16 w-16 items-center justify-center justify-self-center rounded-full bg-white/10 text-2xl font-medium text-white active:bg-white/20"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

function LoginForm({ initialPinEmail }: { initialPinEmail: string | null }) {
  const router = useRouter();
  const params = useSearchParams();
  const [view, setView] = useState<"pin" | "password" | "pin-setup">(initialPinEmail ? "pin" : "password");

  // Password view
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // PIN login view
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSubmitting, setPinSubmitting] = useState(false);

  // PIN setup view
  const [setupStage, setSetupStage] = useState<"enter" | "confirm">("enter");
  const [setupPin, setSetupPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [setupError, setSetupError] = useState("");
  const [setupSubmitting, setSetupSubmitting] = useState(false);

  function goNext() {
    router.push(params.get("next") ?? "/admin");
    router.refresh();
  }

  async function submitPin(value: string) {
    setPinSubmitting(true);
    setPinError("");
    try {
      const res = await fetch("/api/admin/mobile-pin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPinError(data.error ?? "Something went wrong.");
        setPin("");
        setPinSubmitting(false);
        return;
      }
      goNext();
    } catch {
      setPinError("Something went wrong.");
      setPin("");
      setPinSubmitting(false);
    }
  }

  function handlePinDigit(d: string) {
    if (pinSubmitting || pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    if (next.length === PIN_LENGTH) submitPin(next);
  }

  async function handleSetupPin(value: string) {
    setSetupSubmitting(true);
    setSetupError("");
    const res = await fetch("/api/admin/mobile-pin/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: value }),
    });
    const data = await res.json();
    setSetupSubmitting(false);
    if (!res.ok) {
      setSetupError(data.error ?? "Something went wrong.");
      setSetupPin("");
      setConfirmPin("");
      setSetupStage("enter");
      return;
    }
    goNext();
  }

  function handleSetupDigit(d: string) {
    if (setupSubmitting) return;
    if (setupStage === "enter") {
      if (setupPin.length >= PIN_LENGTH) return;
      const next = setupPin + d;
      setSetupPin(next);
      if (next.length === PIN_LENGTH) {
        setSetupError("");
        setSetupStage("confirm");
      }
      return;
    }
    if (confirmPin.length >= PIN_LENGTH) return;
    const next = confirmPin + d;
    setConfirmPin(next);
    if (next.length === PIN_LENGTH) {
      if (next !== setupPin) {
        setSetupError("PINs didn't match. Try again.");
        setSetupPin("");
        setConfirmPin("");
        setSetupStage("enter");
        return;
      }
      handleSetupPin(next);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
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
      setLoading(false);
      if (!data.hasPinSetup) {
        setView("pin-setup");
        return;
      }
      goNext();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  const gradientStyle = { background: "linear-gradient(180deg, var(--color-brand-purple) 0%, #1a0930 100%)" };

  if (view === "pin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5" style={gradientStyle}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <Image src="/logo.svg" alt="Academy" width={281} height={98} className="h-8 w-auto" priority />
          </div>
          <h1 className="mt-1 text-lg font-semibold text-white">Enter your PIN</h1>
          <p className="text-sm text-white/50">{initialPinEmail}</p>
        </div>

        <PinDots length={PIN_LENGTH} filled={pin.length} />
        {pinError && <p className="-mt-4 text-sm font-medium text-red-300">{pinError}</p>}

        <Keypad onDigit={handlePinDigit} onBackspace={() => !pinSubmitting && setPin((p) => p.slice(0, -1))} />

        <button
          type="button"
          onClick={() => {
            setPin("");
            setPinError("");
            setView("password");
          }}
          className="text-sm font-medium text-white/60 underline-offset-4 active:underline"
        >
          Not you? Sign in with email
        </button>
      </div>
    );
  }

  if (view === "pin-setup") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5" style={gradientStyle}>
        <div className="flex flex-col items-center gap-2 text-center">
          <Lock size={28} className="text-white/70" />
          <h1 className="mt-2 text-xl font-bold text-white">Set up a PIN</h1>
          <p className="max-w-[260px] text-sm text-white/50">
            {setupStage === "enter" ? "Choose a 6-digit PIN for faster sign-in on this device next time." : "Confirm your PIN."}
          </p>
        </div>

        <PinDots length={PIN_LENGTH} filled={setupStage === "enter" ? setupPin.length : confirmPin.length} />
        {setupError && <p className="-mt-4 text-sm font-medium text-red-300">{setupError}</p>}

        <Keypad
          onDigit={handleSetupDigit}
          onBackspace={() => {
            if (setupSubmitting) return;
            if (setupStage === "enter") setSetupPin((p) => p.slice(0, -1));
            else setConfirmPin((p) => p.slice(0, -1));
          }}
        />

        <button type="button" onClick={goNext} className="text-sm font-medium text-white/60 underline-offset-4 active:underline">
          Skip for now
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-end px-5 pb-10 pt-16" style={gradientStyle}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <Image src="/logo.svg" alt="Academy" width={281} height={98} className="h-10 w-auto" priority />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Academy Admin</h1>
          <p className="mt-1 text-sm text-white/60">Mobile Access</p>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
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

        {initialPinEmail && (
          <button type="button" onClick={() => setView("pin")} className="text-center text-sm font-medium text-white/60 active:underline">
            Use PIN instead
          </button>
        )}

        <p className="mt-2 text-center text-xs text-white/40">
          Mobile access only — this login is separate from the desktop admin.
        </p>
      </form>
    </div>
  );
}

export default function MobileLoginForm({ initialPinEmail }: { initialPinEmail: string | null }) {
  return (
    <Suspense>
      <LoginForm initialPinEmail={initialPinEmail} />
    </Suspense>
  );
}
