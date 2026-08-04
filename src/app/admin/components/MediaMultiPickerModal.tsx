"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, FolderClosed, Check } from "lucide-react";

type Folder = { id: string; name: string; _count: { assets: number } };
type Asset = { id: string; url: string; name: string | null; altText: string | null };

export default function MediaMultiPickerModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (assets: { url: string; name: string | null }[]) => void;
  onClose: () => void;
}) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [selected, setSelected] = useState<Record<string, Asset>>({});
  const loading = assets === null;

  useEffect(() => {
    fetch("/api/admin/media/folders")
      .then((r) => r.json())
      .then(setFolders);
  }, []);

  useEffect(() => {
    const qs = activeFolder === "all" ? "" : `?folderId=${activeFolder}`;
    fetch(`/api/admin/media${qs}`)
      .then((r) => r.json())
      .then(setAssets);
  }, [activeFolder]);

  function toggle(asset: Asset) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[asset.id]) delete next[asset.id];
      else next[asset.id] = asset;
      return next;
    });
  }

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h3 className="text-base font-bold text-brand-ink">Add Images From Media Library</h3>
          <button type="button" onClick={onClose} className="text-brand-muted hover:text-brand-ink">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 shrink-0 overflow-y-auto border-r border-brand-border p-3">
            <button
              type="button"
              onClick={() => setActiveFolder("all")}
              className={`mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                activeFolder === "all" ? "bg-brand-pink/10 text-brand-pink" : "text-brand-muted hover:bg-brand-surface"
              }`}
            >
              All Images
            </button>
            <button
              type="button"
              onClick={() => setActiveFolder("uncategorized")}
              className={`mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                activeFolder === "uncategorized" ? "bg-brand-pink/10 text-brand-pink" : "text-brand-muted hover:bg-brand-surface"
              }`}
            >
              Uncategorized
            </button>
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                  activeFolder === f.id ? "bg-brand-pink/10 text-brand-pink" : "text-brand-muted hover:bg-brand-surface"
                }`}
              >
                <FolderClosed size={12} className="shrink-0" />
                <span className="truncate">{f.name}</span>
                <span className="ml-auto shrink-0 text-[10px] text-brand-muted">{f._count.assets}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="py-10 text-center text-sm text-brand-muted">Loading...</p>
            ) : assets.length === 0 ? (
              <p className="py-10 text-center text-sm text-brand-muted">No images in this folder yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {assets.map((a) => {
                  const isSelected = Boolean(selected[a.id]);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggle(a)}
                      className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                        isSelected ? "border-brand-pink" : "border-brand-border hover:border-brand-pink/50"
                      }`}
                    >
                      <Image src={a.url} alt={a.altText ?? a.name ?? ""} fill className="object-cover" unoptimized />
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-colors ${
                          isSelected ? "bg-brand-pink/30" : "bg-black/0 group-hover:bg-black/10"
                        }`}
                      >
                        {isSelected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-white">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-brand-border px-5 py-4">
          <p className="text-xs text-brand-muted">{selectedCount} selected</p>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => onConfirm(Object.values(selected))}
            className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-40"
          >
            Add {selectedCount || ""} Image{selectedCount === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}
