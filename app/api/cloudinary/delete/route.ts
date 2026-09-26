import { NextResponse } from "next/server";
import { destroyImage } from "@/lib/cloudinary-server";

export const runtime = "nodejs";

/** Hapus asset Cloudinary berdasarkan secure_url yang dikirim client. */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { url?: string };
    if (typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json({ error: "url wajib diisi." }, { status: 400 });
    }
    await destroyImage(body.url.trim());
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal menghapus gambar." },
      { status: 500 },
    );
  }
}
