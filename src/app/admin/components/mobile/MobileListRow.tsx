import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type MobileListRowProps = {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  showChevron?: boolean;
};

// The mobile equivalent of a <table> row — a grouped-inset-list row (leading icon/avatar,
// title, subtitle, trailing content) every table-style page's mobile card list is built from.
export default function MobileListRow({ leading, title, subtitle, trailing, href, onClick, showChevron = true }: MobileListRowProps) {
  const content = (
    <>
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-brand-ink">{title}</span>
        {subtitle && <span className="mt-0.5 block truncate text-xs text-brand-muted">{subtitle}</span>}
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
      {(href || onClick) && showChevron && <ChevronRight size={16} className="shrink-0 text-brand-muted" />}
    </>
  );

  const className = "flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-brand-surface";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}
