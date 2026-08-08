import type { ReactNode } from "react";

// Bottom sheet — the mobile-native replacement for ConfirmModal.tsx's centered overlay.
// Slides up from the bottom with rounded top corners and a drag-handle bar, iOS action-sheet style.
export default function MobileSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full rounded-t-3xl bg-brand-card p-5 pb-8" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-brand-border" />
        {children}
      </div>
    </div>
  );
}
