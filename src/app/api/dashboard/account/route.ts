import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

const STRING_FIELDS = [
  "displayName",
  "username",
  "bio",
  "location",
  "phone",
  "gender",
  "currentRole",
  "skillLevel",
  "yearsExperience",
  "currentIndustry",
  "currentCompany",
  "weeklyCommitment",
  "preferredLanguage",
  "subtitleLanguage",
  "playbackSpeed",
  "themePreference",
  "portfolioUrl",
  "behanceUrl",
  "dribbbleUrl",
  "githubUrl",
  "linkedinUrl",
  "timezone",
  "country",
] as const;

const ARRAY_FIELD_MAP: Record<string, string> = {
  interests: "interestsJson",
  additionalInterests: "additionalInterestsJson",
  learningGoals: "learningGoalsJson",
  learningStyle: "learningStyleJson",
  softwareFamiliarity: "softwareFamiliarityJson",
};

const BOOLEAN_FIELDS = [
  "isProfilePublic",
  "showLearningActivity",
  "showCompletedCourses",
  "allowMessages",
  "shareProjectsPublicly",
  "followingEnabled",
  "notifyWeeklyReminder",
  "notifyNewCourses",
  "notifyInstructorUpdates",
  "notifyAssignmentDeadlines",
  "notifyProductAnnouncements",
] as const;

export async function PATCH(req: NextRequest) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const data: Record<string, unknown> = {};

  if ("name" in body && typeof body.name === "string" && body.name.trim()) {
    data.name = body.name.trim();
  }

  for (const key of STRING_FIELDS) {
    if (key in body) {
      const value = body[key];
      data[key] = typeof value === "string" && value.trim() ? value.trim() : null;
    }
  }

  if ("dateOfBirth" in body) {
    data.dateOfBirth = typeof body.dateOfBirth === "string" && body.dateOfBirth.trim() ? new Date(body.dateOfBirth) : null;
  }

  for (const [bodyKey, dbKey] of Object.entries(ARRAY_FIELD_MAP)) {
    if (bodyKey in body && Array.isArray(body[bodyKey])) {
      data[dbKey] = JSON.stringify(body[bodyKey]);
    }
  }

  for (const key of BOOLEAN_FIELDS) {
    if (key in body) data[key] = Boolean(body[key]);
  }

  if (Object.keys(data).length > 0) {
    await prisma.user.update({ where: { id: user.id }, data });
  }

  if (body.newPassword) {
    const valid = await bcrypt.compare(body.currentPassword ?? "", user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(body.newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  }

  return NextResponse.json({ ok: true });
}
