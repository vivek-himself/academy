"use client";

import { useState } from "react";

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default function SocialAuthButtons({ label = "Continue with Google" }: { label?: string }) {
  const [notice, setNotice] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setNotice(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
      >
        <GoogleIcon /> {label}
      </button>
      {notice && (
        <p className="mt-2 text-center text-xs text-brand-muted">
          Social sign-in is coming soon — continue with email below for now.
        </p>
      )}
    </div>
  );
}
