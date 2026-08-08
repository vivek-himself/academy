import type { ReactNode } from "react";

// iOS-style grouped form section — a rounded card of rows with an optional header label above
// and footer description below, matching the Settings-app grouped-table-view convention.
export default function MobileFormGroup({
  header,
  footer,
  children,
}: {
  header?: string;
  footer?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {header && <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-brand-muted">{header}</p>}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-card">
        <div className="divide-y divide-brand-border">{children}</div>
      </div>
      {footer && <p className="mt-2 px-1 text-xs text-brand-muted">{footer}</p>}
    </div>
  );
}
