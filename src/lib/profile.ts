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
