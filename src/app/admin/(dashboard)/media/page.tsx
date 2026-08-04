import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import MediaLibraryClient from "./MediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const folders = await prisma.mediaFolder.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { assets: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="Organize every image uploaded through the CMS into folders, rename them, or upload new ones directly here."
      />
      <MediaLibraryClient initialFolders={folders} />
    </div>
  );
}
