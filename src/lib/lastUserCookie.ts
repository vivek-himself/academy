const COOKIE_NAME = "academy_last_user";

export function setLastUser(name: string, email: string) {
  const value = encodeURIComponent(JSON.stringify({ name, email }));
  document.cookie = `${COOKIE_NAME}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function getLastUser(): { name: string; email: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function clearLastUser() {
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`;
}
