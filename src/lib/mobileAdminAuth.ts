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

// A separate, longer-lived cookie marking "this browser already signed in with a full
// email+password at least once" — PIN sign-in only works when this is present, so a 6-digit
// PIN (much weaker than a real password) can never be brute-forced remotely on its own. It
// deliberately survives mobile logout, the same way Face ID/Passcode stays set up on a device
// after signing out of an app.
export const DEVICE_TRUST_COOKIE = "academy_mobile_device_trust";

export async function signDeviceTrust(email: string) {
  return new SignJWT({ email, scope: "mobile-device-trust" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret);
}

export async function verifyDeviceTrust(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.scope !== "mobile-device-trust") return null;
    return payload as { email: string; scope: "mobile-device-trust" };
  } catch {
    return null;
  }
}

export { MOBILE_ADMIN_COOKIE };
