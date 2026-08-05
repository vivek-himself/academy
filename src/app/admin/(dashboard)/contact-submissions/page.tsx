import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";

export const dynamic = "force-dynamic";

export default async function ContactSubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Contact Submissions" subtitle="Messages sent through the Get in Touch form" />
      <div className="flex flex-col gap-3">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-ink">{s.subject}</p>
              <p className="text-xs text-brand-muted">{s.createdAt.toLocaleString()}</p>
            </div>
            <p className="mt-1 text-xs text-brand-muted">
              {s.name} · <a href={`mailto:${s.email}`} className="text-brand-pink hover:underline">{s.email}</a>
            </p>
            <p className="mt-3 whitespace-pre-line text-sm text-brand-ink">{s.message}</p>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="rounded-2xl border border-brand-border bg-brand-card px-5 py-10 text-center text-sm text-brand-muted">
            No messages yet. Submissions from the Get in Touch form will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
