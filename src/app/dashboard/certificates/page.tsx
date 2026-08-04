import { Award } from "lucide-react";

export default function DashboardCertificatesPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-ink">Certificates</h1>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface text-brand-muted">
          <Award size={22} />
        </span>
        <h3 className="text-base font-bold text-brand-ink">Certificates are coming soon</h3>
        <p className="max-w-md text-sm text-brand-muted">
          Finish a course and your certificate will appear here once certificate generation is switched on.
        </p>
      </div>
    </div>
  );
}
