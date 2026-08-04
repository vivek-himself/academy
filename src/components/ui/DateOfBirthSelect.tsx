export const DOB_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - 13 - i);

export type DobValue = { day: string; month: string; year: string };

export function dobToIso({ day, month, year }: DobValue): string | undefined {
  if (!day || !month || !year) return undefined;
  const monthIndex = DOB_MONTHS.indexOf(month) + 1;
  return `${year}-${String(monthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isoToDob(iso: string | null | undefined): DobValue {
  if (!iso) return { day: "", month: "", year: "" };
  const date = new Date(iso);
  return { day: String(date.getUTCDate()), month: DOB_MONTHS[date.getUTCMonth()], year: String(date.getUTCFullYear()) };
}

export default function DateOfBirthSelect({ value, onChange }: { value: DobValue; onChange: (value: DobValue) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        value={value.day}
        onChange={(e) => onChange({ ...value, day: e.target.value })}
        className="rounded-lg border border-brand-border px-2 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink"
      >
        <option value="">Day</option>
        {DAYS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={value.month}
        onChange={(e) => onChange({ ...value, month: e.target.value })}
        className="rounded-lg border border-brand-border px-2 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink"
      >
        <option value="">Month</option>
        {DOB_MONTHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={value.year}
        onChange={(e) => onChange({ ...value, year: e.target.value })}
        className="rounded-lg border border-brand-border px-2 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink"
      >
        <option value="">Year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
