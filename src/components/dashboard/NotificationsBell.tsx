"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Mail } from "lucide-react";

export type NotificationItem = { id: string; title: string; message: string; when: string; read?: boolean };

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-pink px-1 text-[10px] font-bold leading-none text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function NotificationsBell({
  notifications,
  unreadCount,
  unreadMessageCount,
}: {
  notifications: NotificationItem[];
  unreadCount?: number;
  unreadMessageCount?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [justReadIds, setJustReadIds] = useState<Set<string>>(new Set());
  const totalUnread = unreadCount ?? notifications.length;
  const remainingUnread = Math.max(0, totalUnread - justReadIds.size);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleOpenNotification(id: string) {
    setJustReadIds((prev) => new Set(prev).add(id));
    setOpen(false);
    fetch(`/api/dashboard/notifications/${id}/read`, { method: "PATCH" }).catch(() => {});
    router.push("/dashboard/messages");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface"
        >
          <Bell size={16} />
          <CountBadge count={remainingUnread} />
        </button>
        {open && (
          <div className="absolute right-0 top-11 z-30 w-72 overflow-hidden rounded-xl border border-brand-border bg-white shadow-lg">
            <p className="border-b border-brand-border px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-muted">
              Notifications
            </p>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-brand-muted">Nothing yet — start a course to see updates here.</p>
              ) : (
                notifications.map((n) => {
                  const isUnread = !n.read && !justReadIds.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleOpenNotification(n.id)}
                      className="block w-full border-b border-brand-border px-4 py-2.5 text-left last:border-b-0 hover:bg-brand-surface"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />}
                          <p className={`text-xs ${isUnread ? "font-bold text-brand-ink" : "font-semibold text-brand-ink/70"}`}>{n.title}</p>
                        </span>
                        <span className="shrink-0 text-[10px] text-brand-muted">{n.when}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-brand-muted">{n.message}</p>
                    </button>
                  );
                })
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
        <CountBadge count={unreadMessageCount ?? 0} />
      </Link>
    </div>
  );
}
