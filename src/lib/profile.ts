import { safeJsonParse } from "./json";

export type ProfileUser = {
  phone: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
};

export function isProfileComplete(user: ProfileUser) {
  return Boolean(user.phone && user.gender && user.dateOfBirth);
}

export function getProfileCompletionPercent(user: ProfileUser) {
  const fields = [user.phone, user.gender, user.dateOfBirth];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export type FullProfileUser = ProfileUser & {
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
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
 * fields beyond the phone/gender/DOB trio that actually gates course access
 * (see isProfileComplete, which stays scoped to that trio unchanged).
 */
export function getFullProfileCompletionPercent(user: FullProfileUser) {
  const hasItems = (json: string) => safeJsonParse<string[]>(json, []).length > 0;

  const fields = [
    Boolean(user.displayName),
    Boolean(user.username),
    Boolean(user.avatarUrl),
    Boolean(user.bio),
    Boolean(user.location),
    Boolean(user.phone),
    Boolean(user.gender),
    Boolean(user.dateOfBirth),
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
