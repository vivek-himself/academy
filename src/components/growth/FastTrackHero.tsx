import { CheckCircle2 } from "lucide-react";
import ChatBubble from "./ChatBubble";

const checklist = [
  "71% Land 1st Interviews Within 7 Days",
  "94% Land 1st Interviews Within 28 Days",
  "Access The Hidden Job Market",
  "Customer Success Guaranteed",
];

export default function FastTrackHero() {
  return (
    <section className="container-page grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
          Fast-Track Your
          <br />
          <span className="text-brand-pink">Job Search</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm text-brand-muted sm:text-base">
          Want to land your next role in the UAE, KSA or wider GCC? This is your direct solution. We&apos;ll take
          instant action, so you can start landing interviews and offers now, instead of hoping for the best.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {checklist.map((item) => (
            <span key={item} className="flex items-center gap-2 text-xs font-medium text-brand-ink sm:text-sm">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-500" /> {item}
            </span>
          ))}
        </div>
        <button className="mt-6 w-full rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-pink-dark sm:w-auto">
          Fix My Job Search
        </button>
        <div className="mt-4 flex gap-2">
          {["VISA", "MC", "AMEX", "UPI"].map((m) => (
            <span key={m} className="rounded border border-brand-border bg-white px-2 py-1 text-[10px] font-semibold text-brand-muted">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
        <ChatBubble />
        <div className="sm:mt-8">
          <ChatBubble />
        </div>
      </div>
    </section>
  );
}
