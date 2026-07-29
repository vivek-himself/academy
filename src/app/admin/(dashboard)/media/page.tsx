import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";

export const dynamic = "force-dynamic";

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaLibraryPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="Every image uploaded through the CMS. Upload new images from the field where you need them (course cover, mentor photo, etc.)."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {assets.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-xl border border-brand-border bg-white">
            <div className="relative aspect-square w-full bg-brand-surface">
              <Image src={a.url} alt={a.altText ?? ""} fill className="object-cover" unoptimized />
            </div>
            <div className="p-2.5">
              <p className="truncate text-xs font-medium text-brand-ink">{a.url.split("/").pop()}</p>
              <p className="text-[10px] text-brand-muted">
                {a.width && a.height ? `${a.width}×${a.height} · ` : ""}
                {formatSize(a.sizeBytes)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {assets.length === 0 && (
        <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
          No images uploaded yet. Images you upload from any content form will appear here.
        </p>
      )}
    </div>
  );
}
