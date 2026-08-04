import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "academy_student_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-secret-change-me");

export async function signStudentSession(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyStudentSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getStudentSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifyStudentSession(token);
}

export async function requireStudentSession() {
  const session = await getStudentSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export { COOKIE_NAME as STUDENT_COOKIE_NAME };
