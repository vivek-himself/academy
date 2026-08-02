import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center shrink-0">
      <Image src="/logo.svg" alt="Academy" width={281} height={98} className={className} priority />
    </Link>
  );
}
