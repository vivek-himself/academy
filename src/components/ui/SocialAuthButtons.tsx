"use client";

import { useState } from "react";

function GoogleIcon() {
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

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.24 2.68.24v2.95H15.8c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.39A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

export default function SocialAuthButtons() {
  const [notice, setNotice] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => setNotice(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          type="button"
          onClick={() => setNotice(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
        >
          <FacebookIcon /> Continue with Facebook
        </button>
      </div>
      {notice && (
        <p className="mt-2 text-center text-xs text-brand-muted">
          Social sign-in is coming soon — continue with email below for now.
        </p>
      )}
    </div>
  );
}
