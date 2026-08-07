"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Mail } from "lucide-react";

export type NotificationItem = { id: string; title: string; message: string; when: string };

export default function NotificationsBell({
  notifications,
  unreadCount,
  unreadMessageCount,
}: {
  notifications: NotificationItem[];
  unreadCount?: number;
  unreadMessageCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const dotCount = unreadCount ?? notifications.length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface"
        >
          <Bell size={16} />
        </button>
        {dotCount > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-pink" />
        )}
        {open && (
          <div className="absolute right-0 top-11 z-30 w-72 overflow-hidden rounded-xl border border-brand-border bg-white shadow-lg">
            <p className="border-b border-brand-border px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-muted">
              Notifications
            </p>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-brand-muted">Nothing yet — start a course to see updates here.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="border-b border-brand-border px-4 py-2.5 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-brand-ink">{n.title}</p>
                      <span className="shrink-0 text-[10px] text-brand-muted">{n.when}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-brand-muted">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        href="/dashboard/messages?tab=direct"
        aria-label="Direct messages"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface"
      >
        <Mail size={16} />
        {(unreadMessageCount ?? 0) > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-pink" />
        )}
      </Link>
    </div>
  );
}
