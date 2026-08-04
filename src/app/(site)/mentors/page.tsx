import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/SocialIcons";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentors",
};

export default async function MentorsPage() {
  const mentors = await prisma.mentor.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="Learn From"
          highlight="Industry Experts"
          description="Our Mentors Are Seasoned Professionals With Real-World Experience. They Bring Practical Insights And Proven Strategies To Help You Succeed In Your Marketing Career."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="overflow-hidden rounded-2xl border border-brand-border bg-white">
              <div className="relative aspect-[4/3] w-full bg-brand-surface">
                {mentor.imageDesktopUrl && (
                  <Image src={mentor.imageDesktopUrl} alt={mentor.name} fill className="object-cover" />
                )}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-brand-ink">{mentor.name}</h3>
                <p className="text-sm font-medium text-brand-pink">{mentor.role}</p>
                <p className="mt-2 text-sm text-brand-muted">{mentor.bio}</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={mentor.websiteUrl || "#"}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface"
                  >
                    <Globe size={14} />
                  </a>
                  <a
                    href={mentor.linkedinUrl || "#"}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface"
                  >
                    <LinkedInIcon size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12 text-center sm:py-16">
        <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">
          Become A <span className="text-brand-pink">Mentor</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted sm:text-base">
          Are You An Experienced Marketing Professional Passionate About Teaching? Join Our Team Of Expert Mentors
          And Help Shape The Next Generation Of Marketers.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
        >
          Apply To Teach
        </Link>
      </section>

      <CTABanner />
    </>
  );
}
