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
