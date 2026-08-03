import type { Metadata } from "next";
import { HeartPulse, Laptop, TrendingUp, Users, ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { jobPostings } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers — Academy",
};

const perks = [
  { icon: HeartPulse, title: "Health & Wellness", body: "Comprehensive coverage that supports your health, energy, and overall well-being." },
  { icon: Laptop, title: "Flexible Work", body: "Work your way with a remote-first culture and true flexibility in how you operate." },
  { icon: TrendingUp, title: "Career Growth", body: "Learn continuously and unlock real opportunities to grow and evolve professionally." },
  { icon: Users, title: "Great Team", body: "Collaborate with driven, passionate individuals who push you to do your best." },
];

export default function CareersPage() {
  return (
    <section className="container-page py-12 sm:py-16">
      <SectionHeading
        title="Careers"
        description="Join us in shaping the next generation of marketers and leaders. Your journey starts here, but its impact goes much further."
      />

      <div className="mx-auto mt-12 max-w-4xl">
        <h2 className="text-lg font-semibold text-brand-ink">Why Work With Us</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-brand-border p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-sm font-semibold text-brand-ink">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-4xl">
        <h2 className="text-lg font-semibold text-brand-ink">Open Positions</h2>
        <p className="mt-2 text-sm text-brand-muted">
          We&apos;re always on the lookout for great talent. Make sure you apply, as we keep every application on file, and we will be sure to get in touch with you.
        </p>

        <div className="mt-6 space-y-3">
          {jobPostings.map((job) => (
            <details key={job.title} className="group rounded-xl border border-brand-border bg-white p-5 open:border-brand-pink/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-ink">{job.title}</p>
                  <p className="mt-1 text-xs text-brand-muted">
                    {job.department} · {job.location} · {job.type}
                  </p>
                </div>
                <ChevronDown size={18} className="shrink-0 text-brand-muted transition-transform group-open:rotate-180" />
              </summary>

              <div className="mt-5 space-y-4 border-t border-brand-border pt-5 text-sm leading-relaxed text-brand-muted">
                <p>{job.overview}</p>

                <div>
                  <p className="font-semibold text-brand-ink">Key Responsibilities</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {job.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-brand-ink">Educational Qualifications</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {job.qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-brand-ink">Preferred Skills &amp; Experience</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {job.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {job.internshipNote && (
                  <div>
                    <p className="font-semibold text-brand-ink">Internship Learning &amp; Growth Opportunity</p>
                    <p className="mt-2">{job.internshipNote}</p>
                  </div>
                )}

                <div>
                  <p className="font-semibold text-brand-ink">How To Apply</p>
                  <p className="mt-2">
                    You may {job.applyNote || "email your CV and Cover Letter"} to{" "}
                    <a href="mailto:careers@nigelquadros.com" className="font-medium text-brand-pink hover:underline">
                      careers@nigelquadros.com
                    </a>
                    . Please use the subject line: <span className="italic">[Application] Full Name | {job.title} - Academy</span>.
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-4xl rounded-xl border border-brand-border bg-brand-surface p-6 text-sm leading-relaxed text-brand-muted">
        <p className="font-semibold text-brand-ink">Important Notice &amp; Recruitment Disclaimer</p>
        <p className="mt-2">
          Academy does not charge any fees, deposits, registration amounts, training fees, processing fees, or
          placement fees at any stage of the recruitment process. We are not a recruitment agency and do not appoint
          third parties to collect payments or guarantee employment opportunities on our behalf. Candidates are
          advised to remain vigilant and beware of fraudulent communications, fake job offers, or individuals
          claiming to represent Academy. Our official communication channels are strictly limited to
          careers@nigelquadros.com and +91 96650 64435. We strictly do not entertain applications, CV submissions,
          or recruitment-related communication via WhatsApp.
        </p>
        <p className="mt-3 font-semibold text-brand-ink">Application Review Process</p>
        <p className="mt-2">
          Due to the volume of applications we receive, only shortlisted candidates may be contacted. If your
          application is not selected for the current role, your profile may be retained securely in our talent
          database for consideration against future opportunities that match your skills and experience. While we
          genuinely appreciate every application received, we may not be able to provide individual feedback or
          status updates to all applicants. Thank you for taking the time to apply.
        </p>
      </div>
    </section>
  );
}
