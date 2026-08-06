import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import { safeJsonParse } from "@/lib/json";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-ink">Settings</h1>
      <SettingsForm
        initial={{
          name: user.name,
          displayName: user.displayName ?? "",
          username: user.username ?? "",
          bio: user.bio ?? "",
          location: user.location ?? "",
          avatarUrl: user.avatarUrl ?? "",
          coverImageUrl: user.coverImageUrl ?? "",
          phone: user.phone,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
          currentRole: user.currentRole ?? "",
          skillLevel: user.skillLevel ?? "",
          interests: safeJsonParse<string[]>(user.interestsJson, []),
          additionalInterests: safeJsonParse<string[]>(user.additionalInterestsJson, []),
          learningGoals: safeJsonParse<string[]>(user.learningGoalsJson, []),
          yearsExperience: user.yearsExperience ?? "",
          currentIndustry: user.currentIndustry ?? "",
          currentCompany: user.currentCompany ?? "",
          learningStyle: safeJsonParse<string[]>(user.learningStyleJson, []),
          weeklyCommitment: user.weeklyCommitment ?? "",
          preferredLanguage: user.preferredLanguage ?? "",
          subtitleLanguage: user.subtitleLanguage ?? "",
          playbackSpeed: user.playbackSpeed ?? "",
          themePreference: user.themePreference ?? "",
          softwareFamiliarity: safeJsonParse<string[]>(user.softwareFamiliarityJson, []),
          portfolioUrl: user.portfolioUrl ?? "",
          behanceUrl: user.behanceUrl ?? "",
          dribbbleUrl: user.dribbbleUrl ?? "",
          githubUrl: user.githubUrl ?? "",
          linkedinUrl: user.linkedinUrl ?? "",
          timezone: user.timezone ?? "",
          country: user.country ?? "",
          isProfilePublic: user.isProfilePublic,
          showLearningActivity: user.showLearningActivity,
          showCompletedCourses: user.showCompletedCourses,
          allowMessages: user.allowMessages,
          shareProjectsPublicly: user.shareProjectsPublicly,
          followingEnabled: user.followingEnabled,
          notifyWeeklyReminder: user.notifyWeeklyReminder,
          notifyNewCourses: user.notifyNewCourses,
          notifyInstructorUpdates: user.notifyInstructorUpdates,
          notifyAssignmentDeadlines: user.notifyAssignmentDeadlines,
          notifyProductAnnouncements: user.notifyProductAnnouncements,
        }}
      />
    </div>
  );
}
