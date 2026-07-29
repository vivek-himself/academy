import StarRating from "@/components/ui/StarRating";

export default function ChatBubble({ name = "Jon Doe" }: { name?: string }) {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
      <p className="text-sm leading-relaxed text-brand-ink/80">
        Hey Zach! Good news, I&apos;ve just been told I&apos;ve got the role at ******! Absolutely buzzing. They
        should be sending the offer via email within the next week. I&apos;ll share it with you all!
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-ink">{name}</p>
        <StarRating rating={5} size={12} />
      </div>
    </div>
  );
}
