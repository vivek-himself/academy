import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ProfileIncompleteBanner({ missing }: { missing?: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={16} className="shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Your profile is incomplete — you won&apos;t be able to attend a course until it&apos;s finished.
          {missing && missing.length > 0 && <span className="font-medium"> Missing: {missing.join(", ")}.</span>}
        </p>
      </div>
      <Link
        href="/dashboard/settings"
        className="shrink-0 rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
      >
        Complete Profile
      </Link>
    </div>
  );
}
