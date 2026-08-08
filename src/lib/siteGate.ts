import { SignJWT, jwtVerify } from "jose";

export const SITE_UNLOCK_COOKIE = "academy_site_unlock";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-secret-change-me");

export async function signUnlockToken() {
  return new SignJWT({ purpose: "site-unlock" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyUnlockToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.purpose === "site-unlock";
  } catch {
    return false;
  }
}
