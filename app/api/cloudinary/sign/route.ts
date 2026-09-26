import { NextResponse } from "next/server";
import { cloudinaryConfig, signParams, uploadEndpoint } from "@/lib/cloudinary-server";

export const runtime = "nodejs";

/**
 * Tanda tangan upload Cloudinary (mode signed).
 * Body opsional: { publicId?: string } — dipakai bila ingin menimpa asset tertentu.
 */
export async function POST(req: Request) {
  try {
    const { cloud, apiKey, preset } = cloudinaryConfig();
    const body = (await req.json().catch(() => ({}))) as { publicId?: string };

    const params: Record<string, string | number> = {
      timestamp: Math.floor(Date.now() / 1000),
    };
    if (preset) params.upload_preset = preset;
    const publicId = typeof body.publicId === "string" ? body.publicId.trim() : "";
    if (publicId) params.public_id = publicId;

    return NextResponse.json({
      signature: signParams(params),
      timestamp: params.timestamp,
      apiKey,
      cloudName: cloud,
      uploadPreset: preset,
      publicId: publicId || null,
      endpoint: uploadEndpoint(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal membuat signature." },
      { status: 500 },
    );
  }
}
