import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

// There's no multi-admin management UI in this app (one desktop admin identity in practice,
// matching /api/admin/account's "change your own password" scope) — mobile credentials are
// managed the same way: effectively one shared mobile login, set/changed from desktop Settings.

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.mobileAdminUser.findFirst({ select: { email: true } });
  return NextResponse.json({ email: existing?.email ?? null });
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, password } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const existing = await prisma.mobileAdminUser.findFirst();

  if (!existing) {
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.mobileAdminUser.create({ data: { email, passwordHash } });
    return NextResponse.json({ ok: true });
  }

  const data: { email: string; passwordHash?: string } = { email };
  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(password, 10);
  }
  await prisma.mobileAdminUser.update({ where: { id: existing.id }, data });
  return NextResponse.json({ ok: true });
}
