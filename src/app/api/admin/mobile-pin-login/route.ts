import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signMobileAdminSession, MOBILE_ADMIN_COOKIE, verifyDeviceTrust, DEVICE_TRUST_COOKIE } from "@/lib/mobileAdminAuth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  if (!/^\d{6}$/.test(pin ?? "")) {
    return NextResponse.json({ error: "Enter your 6-digit PIN." }, { status: 400 });
  }

  // PIN sign-in only works on a device that already completed a full password login —
  // this is the only thing that keeps a 6-digit PIN from being remotely brute-forceable.
  const trust = await verifyDeviceTrust(req.cookies.get(DEVICE_TRUST_COOKIE)?.value);
  if (!trust) {
    return NextResponse.json({ error: "Sign in with your email and password first." }, { status: 401 });
  }

  const user = await prisma.mobileAdminUser.findUnique({ where: { email: trust.email } });
  if (!user?.pinHash) {
    return NextResponse.json({ error: "PIN sign-in isn't set up for this account." }, { status: 400 });
  }

  if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
    const minutes = Math.ceil((user.pinLockedUntil.getTime() - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
      { status: 429 }
    );
  }

  const valid = await bcrypt.compare(pin, user.pinHash);
  if (!valid) {
    const attempts = user.pinFailedAttempts + 1;
    const locked = attempts >= MAX_ATTEMPTS;
    await prisma.mobileAdminUser.update({
      where: { id: user.id },
      data: { pinFailedAttempts: locked ? 0 : attempts, pinLockedUntil: locked ? new Date(Date.now() + LOCKOUT_MS) : null },
    });
    return NextResponse.json(
      { error: locked ? "Too many attempts. Try again in 15 minutes." : "Incorrect PIN." },
      { status: locked ? 429 : 401 }
    );
  }

  await prisma.mobileAdminUser.update({ where: { id: user.id }, data: { pinFailedAttempts: 0, pinLockedUntil: null } });

  const token = await signMobileAdminSession(user.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(MOBILE_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
