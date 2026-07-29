import Image from "next/image";
import { Play, Rewind, FastForward, Volume2, MessageSquare, Maximize, MoreVertical } from "lucide-react";

export default function VideoPlayerMock() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <Image
        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80"
        alt="Course preview"
        fill
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center gap-1.5 bg-black/30 px-4 sm:gap-3 sm:px-8">
        <h3 className="text-base font-bold leading-tight text-white sm:text-2xl md:text-3xl">
          Step into the
          <br /> future of design
        </h3>
        <p className="hidden max-w-xs text-xs text-white/70 sm:block sm:text-sm">
          Join thousands of designers and teams using this course to turn ideas into high-performing skills, fast.
        </p>
        <div className="mt-1 flex gap-2">
          <button className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-ink sm:px-4 sm:py-2 sm:text-xs">
            Start Free
          </button>
          <button className="rounded-full border border-white/50 px-3 py-1.5 text-[11px] font-semibold text-white sm:px-4 sm:py-2 sm:text-xs">
            Start with AI
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 sm:px-4 sm:pb-3 sm:pt-8">
        <div className="h-1 w-full rounded-full bg-white/25">
          <div className="h-1 w-1/3 rounded-full bg-brand-pink" />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Play size={16} fill="white" />
            <Rewind size={16} />
            <FastForward size={16} />
            <span className="text-[11px] text-white/70">47:38 / 1:52:32</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 size={16} />
            <MessageSquare size={16} />
            <Maximize size={16} />
            <MoreVertical size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
