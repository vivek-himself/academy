import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import MentorsTable from "./MentorsTable";

export const dynamic = "force-dynamic";

export default async function MentorsPage() {
  const mentors = await prisma.mentor.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Mentors & Instructors"
        subtitle="Manage the mentor profiles shown across the site"
        action={
          <Link
            href="/admin/mentors/new"
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            <Plus size={15} /> Add Mentor
          </Link>
        }
      />
      <MentorsTable mentors={mentors} />
    </div>
  );
}
