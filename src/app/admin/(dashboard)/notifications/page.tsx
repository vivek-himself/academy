import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import NotificationComposer from "./NotificationComposer";
import NotificationsList from "./NotificationsList";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [notifications, batches, students] = await Promise.all([
    prisma.notification.findMany({
      include: { batch: { select: { id: true, name: true } }, _count: { select: { recipients: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.batch.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: "asc" } }),
  ]);

  const withReadCounts = await Promise.all(
    notifications.map(async (n) => {
      const readCount = await prisma.notificationRecipient.count({
        where: { notificationId: n.id, readAt: { not: null } },
      });
      return {
        id: n.id,
        title: n.title,
        body: n.body,
        scope: n.scope,
        batch: n.batch,
        createdAt: n.createdAt.toISOString(),
        recipientCount: n._count.recipients,
        readCount,
      };
    })
  );

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Broadcast updates to individual students, a batch, or everyone" />
      <div className="flex flex-col gap-6">
        <NotificationComposer batches={batches} students={students} />
        <NotificationsList notifications={withReadCounts} />
      </div>
    </div>
  );
}
