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

function formatTime12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatClassTimings(days: string[], startTime: string | null | undefined, endTime: string | null | undefined) {
  const dayPart = days.length > 0 ? days.map((d) => DAY_ABBR[d] ?? d).join(", ") : "";
  const timePart = startTime && endTime ? `${formatTime12h(startTime)} – ${formatTime12h(endTime)}` : startTime ? formatTime12h(startTime) : "";
  if (dayPart && timePart) return `${dayPart} · ${timePart}`;
  return dayPart || timePart || null;
}
