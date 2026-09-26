import { createHash } from "node:crypto";
import { publicIdFromUrl } from "@/lib/cloudinary";

export function cloudinaryConfig() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET belum lengkap.",
    );
  }
  return {
    cloud,
    apiKey,
    apiSecret,
    preset: process.env.CLOUDINARY_UPLOAD_PRESET || null,
  };
}

export type SignParams = Record<string, string | number | undefined>;

/** SHA-1 signature: parameter urut + api secret (urutan sesuai dokumentasi Cloudinary). */
export function signParams(params: SignParams): string {
  const { apiSecret } = cloudinaryConfig();
  const query = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(query + apiSecret).digest("hex");
}

export function uploadEndpoint(): string {
  const { cloud } = cloudinaryConfig();
  return `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
}

/**
 * Hapus gambar lama dari Cloudinary setelah field diganti/dikosongkan.
 * Gagal hapus bukan fatal — hanya dicatat.
 */
export async function destroyImage(
  url: string | null | undefined,
): Promise<void> {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;
  try {
    const { apiKey, apiSecret, cloud } = cloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signParams({ public_id: publicId, timestamp });
    const body = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: apiKey,
      signature,
    });
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/image/destroy`,
      { method: "POST", body },
    );
    if (!res.ok) {
      console.error("[cloudinary] destroy gagal", publicId, res.status);
    }
  } catch (e) {
    console.error("[cloudinary] destroy error", publicId, e);
  }
}
