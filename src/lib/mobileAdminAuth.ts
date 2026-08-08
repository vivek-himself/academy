import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const MOBILE_ADMIN_COOKIE = "academy_mobile_admin_session";
// Same secret as the desktop admin/student/site-gate tokens — separation between token types
// comes from the explicit `scope` claim below, not from a different secret.
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-secret-change-me");

export async function signMobileAdminSession(email: string) {
  return new SignJWT({ email, scope: "mobile-admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyMobileAdminSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.scope !== "mobile-admin") return null;
    return payload as { email: string; scope: "mobile-admin" };
  } catch {
    return null;
  }
}

export async function requireMobileAdminSession() {
  const store = await cookies();
  const token = store.get(MOBILE_ADMIN_COOKIE)?.value;
  const session = await verifyMobileAdminSession(token);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export { MOBILE_ADMIN_COOKIE };
