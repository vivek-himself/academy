"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

export default function AvatarUploadField({
  value,
  onChange,
  fallbackLabel,
}: {
  value: string;
  onChange: (url: string) => void;
  fallbackLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
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
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-surface text-lg font-bold text-brand-pink ring-2 ring-brand-border">
          {value ? (
            <Image src={value} alt="Profile photo" fill className="object-cover" unoptimized />
          ) : (
            <span>{fallbackLabel?.charAt(0).toUpperCase() ?? "?"}</span>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 size={18} className="animate-spin text-white" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-surface"
        >
          <Camera size={14} /> {value ? "Change Photo" : "Upload Photo"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
