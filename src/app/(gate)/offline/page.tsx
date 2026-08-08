import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="flex max-w-sm flex-col items-center text-center">
      <Image src="/logo.svg" alt="Academy" width={281} height={98} className="h-12 w-auto brightness-0 invert" priority />
      <h1 className="mt-8 text-2xl font-bold">We&apos;ll be right back</h1>
      <p className="mt-3 text-sm text-white/70">
        Academy is currently offline for a bit of maintenance. Please check back again soon.
      </p>
    </div>
  );
}
