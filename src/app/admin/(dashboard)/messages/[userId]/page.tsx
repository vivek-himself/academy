import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import ThreadView from "./ThreadView";

export const dynamic = "force-dynamic";

export default async function AdminMessageThreadPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const [student, messages] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } }),
    prisma.directMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
  ]);
  if (!student) notFound();

  const data = messages.map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader title={student.name} subtitle={student.email} />
      <ThreadView userId={student.id} messages={data} />
    </div>
  );
}
