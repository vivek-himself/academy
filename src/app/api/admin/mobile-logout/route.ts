import { NextResponse } from "next/server";
import { MOBILE_ADMIN_COOKIE } from "@/lib/mobileAdminAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(MOBILE_ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
