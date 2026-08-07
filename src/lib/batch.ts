import type { PrismaClient, Prisma } from "@/generated/prisma/client";

const DAY_ABBR: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

export const WEEKDAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Times are always stored and displayed in 24-hour "HH:MM" form (hour 01-24) — no AM/PM conversion.
export function formatClassTimings(days: string[], startTime: string | null | undefined, endTime: string | null | undefined) {
  const dayPart = days.length > 0 ? days.map((d) => DAY_ABBR[d] ?? d).join(", ") : "";
  const timePart = startTime && endTime ? `${startTime} – ${endTime}` : startTime || "";
  if (dayPart && timePart) return `${dayPart} · ${timePart}`;
  return dayPart || timePart || null;
}

/**
 * Pushes a batch's instructor-set completedChapters down into every current member's
 * Enrollment.completedModulesJson for the batch's linked course, so every progress bar
 * fed by that field (dashboard, my courses, course watch) updates automatically.
 * No-op if the batch has no linked course.
 */
export async function syncBatchProgress(db: PrismaClient | Prisma.TransactionClient, batchId: string) {
  const batch = await db.batch.findUnique({ where: { id: batchId } });
  if (!batch || !batch.courseId) return;

  const completedModules = Array.from({ length: Math.max(0, batch.completedChapters) }, (_, i) => i);
  await db.enrollment.updateMany({
    where: { courseId: batch.courseId, user: { batchId: batch.id } },
    data: { completedModulesJson: JSON.stringify(completedModules) },
  });
}
