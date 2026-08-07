import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProgress } from "@/lib/enrollment";
import { getFullProfileCompletionPercent } from "@/lib/profile";
import { safeJsonParse } from "@/lib/json";
import PageHeader from "../../../components/PageHeader";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="mt-0.5 text-sm text-brand-ink">{value || "—"}</p>
    </div>
  );
}

function ListField({ label, json }: { label: string; json: string }) {
  const items = safeJsonParse<string[]>(json, []);
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{label}</p>
      {items.length === 0 ? (
        <p className="mt-0.5 text-sm text-brand-ink">—</p>
      ) : (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span key={item} className="rounded-full bg-brand-surface px-2.5 py-1 text-xs text-brand-ink">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-brand-surface text-brand-muted",
  Suspended: "bg-red-50 text-red-600",
};

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      batch: { select: { id: true, name: true } },
      enrollments: { include: { course: { select: { title: true, modulesCount: true } } }, orderBy: { enrolledAt: "desc" } },
    },
  });
  if (!student) notFound();

  const completion = getFullProfileCompletionPercent(student);

  return (
    <div>
      <PageHeader
        title={student.name}
        subtitle={student.email}
        action={
          <Link
            href={`/admin/messages/${student.id}`}
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            <MessageSquare size={15} /> Message this student
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
            <div className="flex items-center gap-4">
              {student.avatarUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image src={student.avatarUrl} alt={student.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-surface text-xl text-brand-muted">
                  {student.name.charAt(0)}
                </span>
              )}
              <div>
                <p className="text-base font-bold text-brand-ink">{student.displayName || student.name}</p>
                <p className="text-sm text-brand-muted">{student.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[student.status] ?? STATUS_STYLES.Active}`}>
                    {student.status}
                  </span>
                  <span className="text-xs text-brand-muted">
                    Batch: {student.batch ? <Link href={`/admin/batches/${student.batch.id}`} className="text-brand-pink hover:underline">{student.batch.name}</Link> : "Unassigned"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-brand-border pt-6 sm:grid-cols-3">
              <Field label="Phone" value={student.phone} />
              <Field label="Gender" value={student.gender} />
              <Field label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : null} />
              <Field label="Location" value={student.location} />
              <Field label="Time Zone" value={student.timezone} />
              <Field label="Country" value={student.country} />
              <Field label="Joined" value={new Date(student.createdAt).toLocaleDateString()} />
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 className="mb-4 text-sm font-bold text-brand-ink">Learning Profile</h3>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <Field label="Current Role" value={student.currentRole} />
              <Field label="Skill Level" value={student.skillLevel} />
              <Field label="Years Experience" value={student.yearsExperience} />
              <Field label="Industry" value={student.currentIndustry} />
              <Field label="Company" value={student.currentCompany} />
              <Field label="Weekly Commitment" value={student.weeklyCommitment} />
              <Field label="Preferred Language" value={student.preferredLanguage} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 border-t border-brand-border pt-5 sm:grid-cols-2">
              <ListField label="Interests" json={student.interestsJson} />
              <ListField label="Learning Goals" json={student.learningGoalsJson} />
              <ListField label="Learning Style" json={student.learningStyleJson} />
              <ListField label="Software Familiarity" json={student.softwareFamiliarityJson} />
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 className="mb-4 text-sm font-bold text-brand-ink">Portfolio & Links</h3>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <Field label="LinkedIn" value={student.linkedinUrl} />
              <Field label="Portfolio" value={student.portfolioUrl} />
              <Field label="GitHub" value={student.githubUrl} />
              <Field label="Behance" value={student.behanceUrl} />
              <Field label="Dribbble" value={student.dribbbleUrl} />
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 className="mb-4 text-sm font-bold text-brand-ink">Enrollment History</h3>
            {student.enrollments.length === 0 ? (
              <p className="text-sm text-brand-muted">Not enrolled in any courses.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {student.enrollments.map((e) => {
                  const progress = getProgress(e.completedModulesJson, e.course.modulesCount);
                  return (
                    <div key={e.courseId} className="rounded-lg bg-brand-surface px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-brand-ink">{e.course.title}</p>
                        <span className="text-xs text-brand-muted">{progress.percent}%</span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-brand-border">
                        <div className="h-full rounded-full bg-brand-pink" style={{ width: `${progress.percent}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-brand-muted">
                        Enrolled {new Date(e.enrolledAt).toLocaleDateString()} · Last accessed {new Date(e.lastAccessedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 className="mb-3 text-sm font-bold text-brand-ink">Profile Strength</h3>
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-border">
              <div className="h-full rounded-full bg-brand-pink" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-2 text-xs text-brand-muted">{completion}% complete</p>
          </div>

          <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 className="mb-3 text-sm font-bold text-brand-ink">Privacy & Notifications</h3>
            <div className="flex flex-col gap-2 text-xs text-brand-muted">
              <p>Public profile: {student.isProfilePublic ? "Yes" : "No"}</p>
              <p>Show learning activity: {student.showLearningActivity ? "Yes" : "No"}</p>
              <p>Show completed courses: {student.showCompletedCourses ? "Yes" : "No"}</p>
              <p>Allows messages: {student.allowMessages ? "Yes" : "No"}</p>
              <p>Product announcements: {student.notifyProductAnnouncements ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
