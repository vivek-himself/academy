import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "academy_admin_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-secret-change-me");

export async function signSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    // Mobile admin tokens share this same signing secret but carry a distinct scope claim —
    // reject them here so mobile credentials can never be used to reach the desktop admin.
    if (payload.scope === "mobile-admin") return null;
    return payload as { email: string };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export { COOKIE_NAME };
