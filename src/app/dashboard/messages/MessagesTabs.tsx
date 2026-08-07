"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "notifications", label: "Notifications" },
  { id: "direct", label: "Direct Messages" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type NotificationRow = { id: string; title: string; body: string; createdAt: string; readAt: string | null };

export default function MessagesTabs({ notifications }: { notifications: NotificationRow[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("notifications");
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  // Mark all unread notifications read once the tab is actually viewed.
  useEffect(() => {
    if (activeTab !== "notifications" || unreadCount === 0) return;
    fetch("/api/dashboard/notifications/read-all", { method: "PATCH" }).then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div>
      <div className="mb-6 flex gap-2 rounded-2xl border border-brand-border bg-white p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? "bg-brand-pink text-white" : "text-brand-ink/70 hover:bg-brand-surface"
            }`}
          >
            {tab.label}
            {tab.id === "notifications" && unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "notifications" && (
        <div className="flex flex-col gap-3">
          {notifications.length === 0 ? (
            <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="rounded-2xl border border-brand-border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-brand-ink">{n.title}</p>
                  <span className="text-xs text-brand-muted">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1.5 text-sm text-brand-muted">{n.body}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "direct" && (
        <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
          Direct messages are coming shortly.
        </p>
      )}
    </div>
  );
}
