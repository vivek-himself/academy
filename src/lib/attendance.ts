const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** UTC midnight for the given date — used as the unique "one attendance record per day" key. */
export function dateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export type ScheduleCheck =
  | { eligible: true }
  | { eligible: false; reason: "no_batch" | "no_schedule" | "wrong_day" | "outside_hours" };

/**
 * Whether `now` falls on one of the batch's scheduled class days, within its start/end time window.
 * classDays/startTime/endTime come from Batch.classDaysJson/startTime/endTime.
 */
export function checkScheduleEligibility(
  classDays: string[],
  startTime: string | null,
  endTime: string | null,
  now: Date
): ScheduleCheck {
  if (!startTime || !endTime || classDays.length === 0) {
    return { eligible: false, reason: "no_schedule" };
  }
  const today = WEEKDAYS[now.getDay()];
  if (!classDays.includes(today)) {
    return { eligible: false, reason: "wrong_day" };
  }
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < toMinutes(startTime) || nowMinutes > toMinutes(endTime)) {
    return { eligible: false, reason: "outside_hours" };
  }
  return { eligible: true };
}
