import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { verifyMobileAdminSession, MOBILE_ADMIN_COOKIE } from "@/lib/mobileAdminAuth";
import { isMobileUserAgent } from "@/lib/device";
import { SITE_UNLOCK_COOKIE, verifyUnlockToken } from "@/lib/siteGate";
import { prisma } from "@/lib/prisma";

// Short in-memory cache so every single request doesn't hit the DB just to read the site
// status — worst case a status change takes a few seconds to take effect everywhere.
let statusCache: { status: string; fetchedAt: number } | null = null;
const STATUS_CACHE_MS = 10_000;

async function getSiteStatus(): Promise<string> {
  const now = Date.now();
  if (statusCache && now - statusCache.fetchedAt < STATUS_CACHE_MS) return statusCache.status;
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" }, select: { siteStatus: true } });
    const status = settings?.siteStatus ?? "live";
    statusCache = { status, fetchedAt: now };
    return status;
  } catch {
    // If the DB is unreachable, fail open rather than locking the whole site out.
    return "live";
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The admin backend (and its API) is always reachable regardless of site status —
  // otherwise nobody could get back in to flip the status back to live.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    // Mobile and desktop devices are gated against entirely separate credential sets —
    // a mobile session cookie never satisfies the desktop check and vice versa (verifySession
    // itself also rejects mobile-scoped tokens, so this isn't just a UA-based formality).
    const mobile = isMobileUserAgent(req.headers.get("user-agent"));
    const authed = mobile
      ? await verifyMobileAdminSession(req.cookies.get(MOBILE_ADMIN_COOKIE)?.value)
      : await verifySession(req.cookies.get(COOKIE_NAME)?.value);

    if (!authed) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin") || pathname === "/api/site-unlock" || pathname === "/offline" || pathname === "/locked") {
    return NextResponse.next();
  }

  const status = await getSiteStatus();

  if (status === "offline") {
    return NextResponse.rewrite(new URL("/offline", req.url));
  }

  if (status === "password_protected") {
    const unlocked = await verifyUnlockToken(req.cookies.get(SITE_UNLOCK_COOKIE)?.value);
    if (!unlocked) {
      return NextResponse.rewrite(new URL("/locked", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|txt|xml)$).*)"],
};
