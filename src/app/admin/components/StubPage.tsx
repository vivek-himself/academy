import { Plug } from "lucide-react";
import PageHeader from "./PageHeader";

export default function StubPage({
  title,
  subtitle,
  needs,
}: {
  title: string;
  subtitle: string;
  needs: string;
}) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface text-brand-muted">
          <Plug size={22} />
        </span>
        <h3 className="text-base font-bold text-brand-ink">Not connected yet</h3>
        <p className="max-w-md text-sm text-brand-muted">{needs}</p>
      </div>
    </div>
  );
}
