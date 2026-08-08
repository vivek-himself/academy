import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SITE_UNLOCK_COOKIE, signUnlockToken } from "@/lib/siteGate";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" }, select: { sitePasswordHash: true } });
  if (!settings?.sitePasswordHash) {
    return NextResponse.json({ error: "This site isn't password protected right now." }, { status: 400 });
  }

  const valid = await bcrypt.compare(password, settings.sitePasswordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await signUnlockToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_UNLOCK_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
