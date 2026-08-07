"use client";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i + 1).padStart(2, "0")); // "01".."24"
const MINUTES = ["00", "30"];

export default function TimeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string; // "" or "HH:MM" (24-hour, hour 01-24)
  onChange: (value: string) => void;
}) {
  const [h, m] = value ? value.split(":") : ["", ""];

  function updateHour(newHour: string) {
    if (!newHour) {
      onChange("");
      return;
    }
    onChange(`${newHour}:${m || "00"}`);
  }

  function updateMinute(newMinute: string) {
    if (!h) return;
    onChange(`${h}:${newMinute}`);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="flex items-center gap-2">
        <select
          value={h}
          onChange={(e) => updateHour(e.target.value)}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink"
        >
          <option value="">HH</option>
          {HOURS.map((hh) => (
            <option key={hh} value={hh}>
              {hh}
            </option>
          ))}
        </select>
        <span className="text-brand-muted">:</span>
        <select
          value={m}
          onChange={(e) => updateMinute(e.target.value)}
          disabled={!h}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-pink disabled:opacity-60"
        >
          <option value="">MM</option>
          {MINUTES.map((mm) => (
            <option key={mm} value={mm}>
              {mm}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-1 text-xs text-brand-muted">24-hour format</p>
    </div>
  );
}
