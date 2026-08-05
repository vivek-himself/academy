"use client";

type BaseProps = {
  label: string;
  description?: string;
  required?: boolean;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
};

function HelpRow({ description, maxLength, value }: { description?: string; maxLength?: number; value: string }) {
  if (!description && !maxLength) return null;
  return (
    <div className="mt-1 flex items-center justify-between gap-3">
      {description ? <p className="text-xs text-brand-muted">{description}</p> : <span />}
      {maxLength && (
        <span className={`shrink-0 text-xs ${value.length > maxLength ? "font-semibold text-red-500" : "text-brand-muted"}`}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

export function TextField({ label, description, required, maxLength, value, onChange, placeholder, type = "text" }: BaseProps & { placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">
        {label} {required && <span className="text-brand-pink">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      />
      <HelpRow description={description} maxLength={maxLength} value={value} />
    </div>
  );
}

export function TextAreaField({
  label,
  description,
  required,
  maxLength,
  value,
  onChange,
  rows = 4,
  placeholder,
}: BaseProps & { rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">
        {label} {required && <span className="text-brand-pink">*</span>}
      </label>
      <textarea
        required={required}
        value={value}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      />
      <HelpRow description={description} maxLength={maxLength} value={value} />
    </div>
  );
}

export function SelectField({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {description && <p className="mt-1 text-xs text-brand-muted">{description}</p>}
    </div>
  );
}

export function NumberField({
  label,
  description,
  value,
  onChange,
  step,
}: {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      <input
        type="number"
        step={step ?? 1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
      />
      {description && <p className="mt-1 text-xs text-brand-muted">{description}</p>}
    </div>
  );
}

export function CheckboxField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-brand-border accent-brand-pink"
      />
      <span>
        <span className="block text-sm font-semibold text-brand-ink">{label}</span>
        {description && <span className="block text-xs text-brand-muted">{description}</span>}
      </span>
    </label>
  );
}
