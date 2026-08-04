"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Folder, FolderPlus, Upload, Loader2, Pencil, Trash2, ChevronRight, MoreHorizontal } from "lucide-react";

type FolderType = { id: string; name: string; _count: { assets: number } };
type Asset = {
  id: string;
  url: string;
  name: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryClient({ initialFolders }: { initialFolders: FolderType[] }) {
  const [folders, setFolders] = useState(initialFolders);
  const [openFolder, setOpenFolder] = useState<FolderType | null>(null);
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [assetMenuOpen, setAssetMenuOpen] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = assets === null;

  function refreshFolders() {
    fetch("/api/admin/media/folders")
      .then((r) => r.json())
      .then((fresh: FolderType[]) => {
        setFolders(fresh);
        if (openFolder) {
          const updated = fresh.find((f) => f.id === openFolder.id);
          setOpenFolder(updated ?? null);
        }
      });
  }

  function refreshAssets() {
    const qs = openFolder ? `?folderId=${openFolder.id}` : "?folderId=uncategorized";
    fetch(`/api/admin/media${qs}`)
      .then((r) => r.json())
      .then(setAssets);
  }

  useEffect(() => {
    refreshAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFolder]);

  async function handleCreateFolder() {
    const name = prompt("Folder name:");
    if (!name || !name.trim()) return;
    const res = await fetch("/api/admin/media/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) refreshFolders();
  }

  async function handleRenameFolder(folder: FolderType) {
    const name = prompt("Rename folder:", folder.name);
    if (!name || !name.trim() || name === folder.name) return;
    const res = await fetch(`/api/admin/media/folders/${folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) refreshFolders();
  }

  async function handleDeleteFolder(folder: FolderType) {
    if (!confirm(`Delete folder "${folder.name}"? Images inside will move to Uncategorized, not be deleted.`)) return;
    const res = await fetch(`/api/admin/media/folders/${folder.id}`, { method: "DELETE" });
    if (res.ok) {
      if (openFolder?.id === folder.id) setOpenFolder(null);
      refreshFolders();
    }
  }

  async function handleUpload(files: FileList | File[]) {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        if (openFolder) formData.append("folderId", openFolder.id);
        await fetch("/api/admin/upload", { method: "POST", body: formData });
      }
      refreshAssets();
      refreshFolders();
    } finally {
      setUploading(false);
    }
  }

  async function handleRenameAsset(asset: Asset) {
    const name = prompt("Rename image:", asset.name ?? asset.url.split("/").pop() ?? "");
    if (!name || !name.trim()) return;
    const res = await fetch(`/api/admin/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) refreshAssets();
  }

  async function handleMoveAsset(asset: Asset, folderId: string) {
    const res = await fetch(`/api/admin/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId: folderId === "uncategorized" ? null : folderId }),
    });
    if (res.ok) {
      refreshFolders();
      refreshAssets();
    }
  }

  async function handleDeleteAsset(asset: Asset) {
    if (!confirm("Delete this image permanently? This can't be undone, and it may still be referenced elsewhere on your site.")) return;
    const res = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
    if (res.ok) {
      refreshAssets();
      refreshFolders();
    }
  }

  const showEmptyState = !loading && assets.length === 0 && (openFolder || folders.length === 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <button
            type="button"
            onClick={() => setOpenFolder(null)}
            className={`font-semibold ${openFolder ? "text-brand-muted hover:text-brand-ink" : "text-brand-ink"}`}
          >
            Media Library
          </button>
          {openFolder && (
            <>
              <ChevronRight size={14} className="text-brand-muted" />
              <span className="font-semibold text-brand-ink">{openFolder.name}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateFolder}
            className="flex items-center gap-1.5 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-surface"
          >
            <FolderPlus size={15} /> New folder
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) handleUpload(files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading..." : "Upload images"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">Loading...</p>
      ) : showEmptyState && !openFolder ? (
        <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
          No folders or images yet. Create a folder or upload your first image.
        </p>
      ) : showEmptyState ? (
        <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
          No images in this folder yet. Upload one, or move existing images here.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {!openFolder &&
            folders.map((f) => (
              <div key={f.id} className="group relative overflow-hidden rounded-xl border border-brand-border bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFolder(f)}
                  className="flex w-full flex-col items-center gap-2 px-3 pb-3 pt-6 text-center hover:bg-brand-surface"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                    <Folder size={30} fill="currentColor" className="opacity-90" />
                  </span>
                  <span className="w-full truncate text-xs font-semibold text-brand-ink">{f.name}</span>
                  <span className="text-[10px] text-brand-muted">
                    {f._count.assets} {f._count.assets === 1 ? "image" : "images"}
                  </span>
                </button>
                <div className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setAssetMenuOpen(assetMenuOpen === f.id ? null : f.id)}
                      aria-label="Folder options"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-muted shadow hover:text-brand-ink"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {assetMenuOpen === f.id && (
                      <div className="absolute right-0 top-7 z-10 w-32 overflow-hidden rounded-lg border border-brand-border bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setAssetMenuOpen(null);
                            handleRenameFolder(f);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-brand-ink hover:bg-brand-surface"
                        >
                          <Pencil size={12} /> Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAssetMenuOpen(null);
                            handleDeleteFolder(f);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {assets.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-xl border border-brand-border bg-white">
              <div className="relative aspect-square w-full bg-brand-surface">
                <Image src={a.url} alt={a.name ?? ""} fill className="object-cover" unoptimized />
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-brand-ink" title={a.name ?? a.url}>
                  {a.name ?? a.url.split("/").pop()}
                </p>
                <p className="text-[10px] text-brand-muted">
                  {a.width && a.height ? `${a.width}×${a.height} · ` : ""}
                  {formatSize(a.sizeBytes)}
                </p>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <select
                    value={openFolder ? openFolder.id : "uncategorized"}
                    onChange={(e) => e.target.value && handleMoveAsset(a, e.target.value)}
                    className="w-full max-w-[90px] truncate rounded border border-brand-border px-1 py-0.5 text-[10px] text-brand-muted outline-none"
                  >
                    <option value="uncategorized">Uncategorized</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRenameAsset(a)}
                    aria-label="Rename"
                    className="shrink-0 text-brand-muted hover:text-brand-ink"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(a)}
                    aria-label="Delete"
                    className="shrink-0 text-brand-muted hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
