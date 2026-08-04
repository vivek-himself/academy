"use client";

export default function SaveBar({
  onSave,
  saving,
  status,
  label = "Save Changes",
  savingLabel = "Saving...",
  type = "button",
}: {
  onSave?: () => void;
  saving: boolean;
  status?: string;
  label?: string;
  savingLabel?: string;
  /** Use "submit" when this sits inside a <form onSubmit={...}> and shouldn't also fire onSave via click. */
  type?: "button" | "submit";
}) {
  return (
    <div className="sticky bottom-0 z-30 -mx-8 mt-2 flex items-center gap-4 border-t border-brand-border bg-white/90 px-8 py-4 backdrop-blur">
      <button
        type={type}
        onClick={type === "button" ? onSave : undefined}
        disabled={saving}
        className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
      >
        {saving ? savingLabel : label}
      </button>
      {status && <p className="text-sm font-medium text-brand-ink">{status}</p>}
    </div>
  );
}
