import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import MentorForm, { type MentorFormValue } from "../MentorForm";

export const dynamic = "force-dynamic";

export default async function EditMentorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mentor = await prisma.mentor.findUnique({ where: { id } });
  if (!mentor) notFound();

  const initial: MentorFormValue = {
    id: mentor.id,
    name: mentor.name,
    role: mentor.role,
    bio: mentor.bio,
    imageDesktopUrl: mentor.imageDesktopUrl ?? "",
    imageMobileUrl: mentor.imageMobileUrl ?? "",
    linkedinUrl: mentor.linkedinUrl ?? "",
    websiteUrl: mentor.websiteUrl ?? "",
  };

  return (
    <div>
      <PageHeader title="Edit Mentor" subtitle={mentor.name} />
      <MentorForm initial={initial} />
    </div>
  );
}
