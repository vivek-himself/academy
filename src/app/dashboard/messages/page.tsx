import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import MessagesTabs from "./MessagesTabs";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const recipients = await prisma.notificationRecipient.findMany({
    where: { userId: session.userId },
    include: { notification: true },
    orderBy: { notification: { createdAt: "desc" } },
  });

  const notifications = recipients.map((r) => ({
    id: r.id,
    title: r.notification.title,
    body: r.notification.body,
    createdAt: r.notification.createdAt.toISOString(),
    readAt: r.readAt ? r.readAt.toISOString() : null,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-ink">Messages</h1>
      <MessagesTabs notifications={notifications} />
    </div>
  );
}
