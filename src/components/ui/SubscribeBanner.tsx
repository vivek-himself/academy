"use client";

import Image from "next/image";

export default function SubscribeBanner({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-2xl bg-brand-purple px-6 py-10 sm:px-12 sm:py-14">
        {imageUrl && (
          <>
            <Image src={imageUrl} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/90 via-brand-purple/60 to-brand-purple/30" />
          </>
        )}
        <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Join and get amazing discount</h3>
            <p className="mt-2 max-w-md text-sm text-white/70">
              It is a long established fact that a reader will be distracted
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full rounded-full bg-white/15 px-5 py-3 text-sm text-white placeholder:text-white/60 outline-none ring-1 ring-white/20 focus:ring-white/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
