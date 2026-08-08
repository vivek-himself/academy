const MOBILE_UA_PATTERN = /iPhone|iPod|Android|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_PATTERN.test(userAgent);
}
