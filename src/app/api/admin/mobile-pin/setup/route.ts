import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireMobileAdminSession } from "@/lib/mobileAdminAuth";

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireMobileAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pin } = await req.json();
  if (!/^\d{6}$/.test(pin ?? "")) {
    return NextResponse.json({ error: "PIN must be exactly 6 digits." }, { status: 400 });
  }

  const pinHash = await bcrypt.hash(pin, 10);
  await prisma.mobileAdminUser.update({
    where: { email: session.email },
    data: { pinHash, pinFailedAttempts: 0, pinLockedUntil: null },
  });

  return NextResponse.json({ ok: true });
}
