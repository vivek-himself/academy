import Image from "next/image";
import Link from "next/link";

export default function ExploreHero({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="container-page pt-8">
      <div className="relative overflow-hidden rounded-2xl bg-brand-purple px-6 py-10 sm:px-12 sm:py-14">
        {imageUrl && (
          <>
            <Image src={imageUrl} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/90 via-brand-purple/50 to-transparent" />
          </>
        )}
        <div className="relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/60">Online Course</span>
          <h1 className="mt-2 max-w-lg text-2xl font-bold text-white sm:text-3xl">
            Sharpen Your Skills With Professional Online Courses
          </h1>
          <Link
            href="#grid"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            Join Now <span aria-hidden>➤</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
