import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple text-white">
        <ShieldCheck size={20} strokeWidth={2.25} />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-brand-ink">
        ACADEMY
      </span>
    </Link>
  );
}
