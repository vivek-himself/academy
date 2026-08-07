"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";

export default function AuthModalShell({
  subtitle = "Unlimited access to our resources",
  children,
}: {
  subtitle?: string;
  children: React.ReactNode;
}) {
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
          <p className="mt-4 text-lg text-brand-muted">{subtitle}</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">{children}</div>

        <div className="flex items-center justify-center gap-1 border-t border-brand-border px-8 py-4 text-sm text-brand-muted">
          English (United States)
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}
