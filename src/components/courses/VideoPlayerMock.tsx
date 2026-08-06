import Image from "next/image";

export default function VideoPlayerMock({ title, image }: { title: string; image?: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <Image
        src={image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80"}
        alt={title}
        fill
        className="object-cover"
      />
    </div>
  );
}
