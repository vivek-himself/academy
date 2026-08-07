import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    include: {
      batch: { select: { id: true, name: true } },
      _count: { select: { recipients: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const withReadCounts = await Promise.all(
    notifications.map(async (n) => {
      const readCount = await prisma.notificationRecipient.count({
        where: { notificationId: n.id, readAt: { not: null } },
      });
      return { ...n, readCount };
    })
  );

  return NextResponse.json(withReadCounts);
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, body: messageBody, scope, batchId, userId } = body;

  if (!title || !messageBody || !scope) {
    return NextResponse.json({ error: "Title, body, and scope are required." }, { status: 400 });
  }
  if (scope === "batch" && !batchId) {
    return NextResponse.json({ error: "batchId is required for batch scope." }, { status: 400 });
  }
  if (scope === "individual" && !userId) {
    return NextResponse.json({ error: "userId is required for individual scope." }, { status: 400 });
  }

  const notification = await prisma.$transaction(async (tx) => {
    let recipientIds: string[] = [];
    if (scope === "all") {
      const users = await tx.user.findMany({ select: { id: true } });
      recipientIds = users.map((u) => u.id);
    } else if (scope === "batch") {
      const users = await tx.user.findMany({ where: { batchId }, select: { id: true } });
      recipientIds = users.map((u) => u.id);
    } else if (scope === "individual") {
      recipientIds = [userId];
    }

    const created = await tx.notification.create({
      data: {
        title,
        body: messageBody,
        scope,
        batchId: scope === "batch" ? batchId : null,
        sentByAdminEmail: session.email,
      },
    });

    if (recipientIds.length > 0) {
      await tx.notificationRecipient.createMany({
        data: recipientIds.map((uid) => ({ notificationId: created.id, userId: uid })),
        skipDuplicates: true,
      });
    }

    return created;
  });

  return NextResponse.json(notification);
}
