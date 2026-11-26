import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { MAX_IMAGE_BYTES, sniffImageType, uploadImage } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * Unggah gambar admin ke Supabase Storage (bucket `images`).
 * Service key hanya hidup di server; browser cukup mengirim file lewat sini.
 * Penghapusan gambar lama dilakukan oleh saveSettingsAction setelah disimpan.
 */

const FOLDERS = new Set(["qris", "banner"]);

const reply = (error: string, status: number): NextResponse =>
  NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (!(await isAdmin())) return reply("Sesi habis. Silakan login ulang.", 401);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return reply("File tidak ditemukan.", 400);
  if (file.size === 0) return reply("File kosong.", 400);
  if (file.size > MAX_IMAGE_BYTES) {
    return reply(`Ukuran maksimal ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`, 413);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffImageType(bytes);
  if (!mime) return reply("Format harus JPG, PNG, atau WebP.", 415);

  const rawFolder = form?.get("folder");
  const folder = typeof rawFolder === "string" && FOLDERS.has(rawFolder) ? rawFolder : "banner";

  try {
    const url = await uploadImage(bytes, mime, folder);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[upload] gagal", e);
    return reply("Gagal menyimpan gambar ke Supabase Storage.", 502);
  }
}
