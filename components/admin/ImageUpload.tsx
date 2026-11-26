"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (next: string | null) => void;
  /** rasio bingkai preview: "wide" (banner) atau "square" (QRIS) */
  frame?: "wide" | "square";
  /** subfolder di bucket Supabase Storage */
  folder?: "qris" | "banner";
};

type Status = { kind: "idle" | "busy" | "error" | "saved"; text?: string };

export default function ImageUpload({
  label,
  hint,
  value,
  onChange,
  frame = "wide",
  folder = "banner",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function pickFile() {
    inputRef.current?.click();
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setStatus({ kind: "error", text: "Format harus JPG, PNG, atau WebP." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus({
        kind: "error",
        text: `Ukuran maksimal 2 MB (file ini ${Math.round(file.size / 1024)} KB).`,
      });
      return;
    }

    setStatus({ kind: "busy", text: "Mengunggah…" });
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) throw new Error(payload.error || "Upload gagal.");
      if (!payload.url) throw new Error("URL gambar tidak diterima.");

      // Gambar lama baru dihapus server setelah "Simpan Pengaturan" ditekan,
      // supaya tidak ada gambar hilang kalau perubahan dibatalkan.
      onChange(payload.url);
      setStatus({ kind: "saved", text: "Terkirim. Jangan lupa tekan Simpan Pengaturan." });
    } catch (e) {
      setStatus({
        kind: "error",
        text: e instanceof Error ? e.message : "Upload gagal.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const box =
    frame === "square"
      ? "aspect-square w-full max-w-[260px]"
      : "aspect-[16/9] w-full";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-medium text-navy">{label}</span>
        {hint && <span className="text-xs text-ink">{hint}</span>}
      </div>

      <div
        className={`relative grid place-items-center overflow-hidden rounded-xl border border-dashed border-[#c9d2e0] bg-tint ${box}`}
      >
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            sizes={frame === "square" ? "260px" : "(min-width: 640px) 400px, 100vw"}
            className="object-contain"
          />
        ) : (
          <div className="px-4 text-center">
            <p className="text-[13px] font-medium text-ink">Belum ada gambar</p>
            <p className="mt-0.5 text-xs text-ink/80">Akan memakai bawaan situs.</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="sr-only"
        aria-label={`Pilih file untuk ${label}`}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={pickFile}
          disabled={status.kind === "busy"}
          className="rounded-[10px] border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition hover:bg-tint disabled:opacity-60"
        >
          {value ? "Ganti gambar" : "Unggah gambar"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setStatus({ kind: "idle" });
            }}
            className="rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[#b3261e] transition hover:bg-red-50"
          >
            Hapus
          </button>
        )}
        <span className="text-xs text-ink">JPG/PNG/WebP, maks 2 MB</span>
      </div>

      {status.kind !== "idle" && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`mt-2 text-xs font-medium ${
            status.kind === "error"
              ? "text-[#8c1d18]"
              : status.kind === "saved"
                ? "text-emerald-700"
                : "text-ink"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
