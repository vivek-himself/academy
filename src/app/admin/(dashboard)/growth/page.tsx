import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";

export const dynamic = "force-dynamic";

export default async function GrowthPagesPage() {
  const pages = await prisma.growthPage.findMany();

  return (
    <div>
      <PageHeader title="Growth Program Pages" subtitle="Edit the Complete CV Rebrand, LinkedIn Optimisation, and Job Search Consultation landing pages" />
      <div className="rounded-2xl border border-brand-border bg-white">
        {pages.map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b border-brand-border px-5 py-4 last:border-0">
            <div>
              <p className="text-sm font-medium text-brand-ink">
                {p.title} {p.titleHighlight}
              </p>
              <p className="text-xs text-brand-muted">/growth/{p.slug}</p>
            </div>
            <Link
              href={`/admin/growth/${p.slug}`}
              className="flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-surface"
            >
              <Pencil size={13} /> Edit
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link href="/admin/pricing" className="text-sm font-semibold text-brand-pink hover:underline">
          Also see: manage the Packages pricing table →
        </Link>
      </div>
    </div>
  );
}
