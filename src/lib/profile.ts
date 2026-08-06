import { safeJsonParse } from "./json";

export type ProfileUser = {
  name: string;
  displayName: string | null;
  avatarUrl: string | null;
  location: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  linkedinUrl: string | null;
  timezone: string | null;
  country: string | null;
};

export const MANDATORY_PROFILE_FIELDS: { key: keyof ProfileUser; label: string }[] = [
  { key: "avatarUrl", label: "Profile Photo" },
  { key: "name", label: "Full Name" },
  { key: "displayName", label: "Display Name" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone Number" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "linkedinUrl", label: "LinkedIn" },
  { key: "timezone", label: "Time Zone" },
  { key: "country", label: "Country" },
];

export function isProfileComplete(user: ProfileUser) {
  return MANDATORY_PROFILE_FIELDS.every((f) => Boolean(user[f.key]));
}

export function getProfileCompletionPercent(user: ProfileUser) {
  const filled = MANDATORY_PROFILE_FIELDS.filter((f) => Boolean(user[f.key])).length;
  return Math.round((filled / MANDATORY_PROFILE_FIELDS.length) * 100);
}

export function getMissingProfileFields(user: ProfileUser): string[] {
  return MANDATORY_PROFILE_FIELDS.filter((f) => !user[f.key]).map((f) => f.label);
}

export type FullProfileUser = ProfileUser & {
  bio: string | null;
  currentRole: string | null;
  skillLevel: string | null;
  interestsJson: string;
  learningGoalsJson: string;
  weeklyCommitment: string | null;
  preferredLanguage: string | null;
  yearsExperience: string | null;
  learningStyleJson: string;
};

/**
 * Broader "profile strength" meter shown in Settings — covers personalization
 * fields on top of the mandatory set that actually gates course access
 * (see isProfileComplete / MANDATORY_PROFILE_FIELDS).
 */
export function getFullProfileCompletionPercent(user: FullProfileUser) {
  const hasItems = (json: string) => safeJsonParse<string[]>(json, []).length > 0;

  const fields = [
    Boolean(user.displayName),
    Boolean(user.avatarUrl),
    Boolean(user.bio),
    Boolean(user.location),
    Boolean(user.phone),
    Boolean(user.gender),
    Boolean(user.dateOfBirth),
    Boolean(user.linkedinUrl),
    Boolean(user.timezone),
    Boolean(user.country),
    Boolean(user.currentRole),
    Boolean(user.skillLevel),
    hasItems(user.interestsJson),
    hasItems(user.learningGoalsJson),
    Boolean(user.weeklyCommitment),
    Boolean(user.preferredLanguage),
    Boolean(user.yearsExperience),
    hasItems(user.learningStyleJson),
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
