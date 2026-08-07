import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminMessagesInboxPage() {
  const messages = await prisma.directMessage.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const threads = new Map<
    string,
    { user: { id: string; name: string; email: string }; lastBody: string; lastAt: Date; unreadCount: number }
  >();
  for (const m of messages) {
    if (!threads.has(m.userId)) {
      threads.set(m.userId, { user: m.user, lastBody: m.body, lastAt: m.createdAt, unreadCount: 0 });
    }
    if (m.sender === "student" && !m.readAt) {
      threads.get(m.userId)!.unreadCount += 1;
    }
  }
  const rows = Array.from(threads.values()).sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());

  return (
    <div>
      <PageHeader title="Direct Messages" subtitle="Conversations with students" />
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-brand-border bg-brand-card px-5 py-10 text-center text-sm text-brand-muted">
          No conversations yet.
        </p>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-brand-card">
          <div className="divide-y divide-brand-border">
            {rows.map((row) => (
              <Link
                key={row.user.id}
                href={`/admin/messages/${row.user.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-brand-surface"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-ink">{row.user.name}</p>
                  <p className="truncate text-xs text-brand-muted">{row.lastBody}</p>
                </div>
                {row.unreadCount > 0 && (
                  <span className="shrink-0 rounded-full bg-brand-pink px-2 py-0.5 text-[11px] font-semibold text-white">
                    {row.unreadCount} new
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
