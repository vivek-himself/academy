"use client";

export default function ChipMultiSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            aria-pressed={active}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active ? "border-brand-pink bg-brand-pink/10 text-brand-pink" : "border-brand-border text-brand-ink/80 hover:bg-brand-surface"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
