"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

type Slot = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommendedSize: string;
};

function UploadSlot({ label, value, onChange, recommendedSize }: Slot) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-brand-ink">{label}</p>
      <div className="rounded-xl border border-dashed border-brand-border bg-brand-surface p-3">
        {value ? (
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white">
              <Image src={value} alt={label} fill className="object-cover" unoptimized />
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-brand-border bg-white text-brand-muted hover:border-brand-pink/40 hover:text-brand-pink"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            <span className="text-xs font-medium">{loading ? "Uploading..." : "Click to upload"}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-xs font-semibold text-brand-pink hover:underline"
          >
            Replace image
          </button>
        )}
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-brand-muted">
        Recommended: {recommendedSize} · JPG, PNG, WebP, GIF or SVG · Max 8MB
      </p>
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export default function ImageUploadField({
  label,
  desktopValue,
  onDesktopChange,
  mobileValue,
  onMobileChange,
  desktopSize = "1600 × 900px",
  mobileSize = "800 × 800px",
}: {
  label: string;
  desktopValue: string;
  onDesktopChange: (url: string) => void;
  mobileValue?: string;
  onMobileChange?: (url: string) => void;
  desktopSize?: string;
  mobileSize?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-brand-ink">{label}</p>
      <div className={`grid grid-cols-1 gap-4 ${onMobileChange ? "sm:grid-cols-2" : ""}`}>
        <UploadSlot label="Desktop image" value={desktopValue} onChange={onDesktopChange} recommendedSize={desktopSize} />
        {onMobileChange && (
          <UploadSlot
            label="Mobile image (optional)"
            value={mobileValue ?? ""}
            onChange={onMobileChange}
            recommendedSize={mobileSize}
          />
        )}
      </div>
    </div>
  );
}
