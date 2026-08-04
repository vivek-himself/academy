import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardGrowthPage() {
  const pages = await prisma.growthPage.findMany({ select: { slug: true, eyebrow: true, title: true, titleHighlight: true } });

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-brand-ink">Growth Programs</h1>
      <p className="mb-6 text-sm text-brand-muted">Career services to help you land the next role.</p>

      {pages.length === 0 ? (
        <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
          No growth programs published yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/growth/${p.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-brand-border bg-white p-5 hover:border-brand-pink"
            >
              <div>
                {p.eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-pink">{p.eyebrow}</p>}
                <p className="mt-1 text-sm font-bold text-brand-ink">
                  {p.title} {p.titleHighlight}
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-brand-muted group-hover:text-brand-pink" />
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/growth/packages"
        className="mt-6 inline-block rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
      >
        View Packages
      </Link>
    </div>
  );
}
