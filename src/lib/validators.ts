const LINKEDIN_URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)?linkedin\.com\/.+/i;

export function isValidLinkedInUrl(value: string): boolean {
  return LINKEDIN_URL_PATTERN.test(value.trim());
}

export const LINKEDIN_URL_ERROR = "Enter a real LinkedIn URL (e.g. https://linkedin.com/in/yourname).";
