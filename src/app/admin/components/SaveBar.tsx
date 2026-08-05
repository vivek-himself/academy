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
    <>
      {/* Spacer so the fixed bar below never covers the last field in the form. */}
      <div className="h-20" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-end gap-4 border-t border-brand-border bg-brand-card/95 px-8 backdrop-blur lg:left-64">
        {status && <p className="text-sm font-medium text-brand-ink">{status}</p>}
        <button
          type={type}
          onClick={type === "button" ? onSave : undefined}
          disabled={saving}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? savingLabel : label}
        </button>
      </div>
    </>
  );
}
