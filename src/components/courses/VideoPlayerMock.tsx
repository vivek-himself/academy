import Image from "next/image";
import { Play, Rewind, FastForward, Volume2, MessageSquare, Maximize, MoreVertical } from "lucide-react";

export default function VideoPlayerMock({ title, image }: { title: string; image?: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <Image
        src={image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80"}
        alt={title}
        fill
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center gap-1.5 bg-black/30 px-4 sm:gap-3 sm:px-8">
        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Preview
        </span>
        <h3 className="max-w-md text-base font-bold leading-tight text-white sm:text-2xl md:text-3xl">{title}</h3>
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
            <span className="text-[11px] text-white/70">Preview</span>
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
