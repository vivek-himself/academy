import type { ComponentType } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  GmailIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";

export type SocialPlatformKey = "instagram" | "facebook" | "linkedin" | "whatsapp" | "gmail" | "x" | "youtube";

export type SocialLink = { url: string; hidden: boolean };
export type SocialLinksMap = Record<SocialPlatformKey, SocialLink>;

export const SOCIAL_PLATFORMS: {
  key: SocialPlatformKey;
  label: string;
  placeholder: string;
  icon: ComponentType<{ size?: number }>;
}[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle", icon: InstagramIcon },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage", icon: FacebookIcon },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourpage", icon: LinkedInIcon },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/919999999999", icon: WhatsAppIcon },
  { key: "gmail", label: "Gmail", placeholder: "mailto:hello@yoursite.com", icon: GmailIcon },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourhandle", icon: XIcon },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel", icon: YoutubeIcon },
];

export function emptySocialLinks(): SocialLinksMap {
  return Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.key, { url: "", hidden: false }])) as SocialLinksMap;
}

/** Reads either the old shape ({linkedin: "url"}) or the new one ({linkedin: {url, hidden}}) so existing saved settings keep working. */
export function normalizeSocialLinks(raw: unknown): SocialLinksMap {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const result = emptySocialLinks();
  for (const { key } of SOCIAL_PLATFORMS) {
    const entry = obj[key];
    if (entry && typeof entry === "object") {
      const e = entry as { url?: string; hidden?: boolean };
      result[key] = { url: e.url ?? "", hidden: !!e.hidden };
    } else if (typeof entry === "string") {
      result[key] = { url: entry === "#" ? "" : entry, hidden: false };
    }
  }
  return result;
}
