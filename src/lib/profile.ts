export type ProfileUser = {
  phone: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
};

export function isProfileComplete(user: ProfileUser) {
  return Boolean(user.phone && user.gender && user.dateOfBirth);
}
