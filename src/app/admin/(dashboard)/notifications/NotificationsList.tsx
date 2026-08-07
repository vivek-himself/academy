"use client";

type NotificationRow = {
  id: string;
  title: string;
  body: string;
  scope: string;
  batch: { id: string; name: string } | null;
  createdAt: string;
  recipientCount: number;
  readCount: number;
};

function scopeLabel(n: NotificationRow) {
  if (n.scope === "all") return "Everyone";
  if (n.scope === "batch") return n.batch ? `Batch: ${n.batch.name}` : "Batch (deleted)";
  return "Individual";
}

export default function NotificationsList({ notifications }: { notifications: NotificationRow[] }) {
  if (notifications.length === 0) {
    return (
      <p className="rounded-2xl border border-brand-border bg-brand-card px-5 py-10 text-center text-sm text-brand-muted">
        No notifications sent yet.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card">
      <div className="divide-y divide-brand-border">
        {notifications.map((n) => (
          <div key={n.id} className="px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-brand-ink">{n.title}</p>
              <span className="text-xs text-brand-muted">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm text-brand-muted">{n.body}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted">
              <span>{scopeLabel(n)}</span>
              <span>
                Delivered to {n.recipientCount} · Read by {n.readCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
