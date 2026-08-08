import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signMobileAdminSession, MOBILE_ADMIN_COOKIE, signDeviceTrust, DEVICE_TRUST_COOKIE } from "@/lib/mobileAdminAuth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.mobileAdminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signMobileAdminSession(user.email);
  const deviceTrustToken = await signDeviceTrust(user.email);
  const res = NextResponse.json({ ok: true, hasPinSetup: Boolean(user.pinHash) });
  res.cookies.set(MOBILE_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  // A full password login always (re-)marks this browser as a trusted device for PIN sign-in,
  // regardless of whether a PIN is set up yet.
  res.cookies.set(DEVICE_TRUST_COOKIE, deviceTrustToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return res;
}
