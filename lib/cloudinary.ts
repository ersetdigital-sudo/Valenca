export type CloudinaryOpts = {
  w?: number;
  h?: number;
  /** crop fill when both w and h are set */
  fill?: boolean;
};

const UPLOAD_RE =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw)\/upload\/)(.*)$/;

function isTransformationSegment(segment: string): boolean {
  if (!segment || segment.includes(".")) return false;
  if (/^v\d+$/.test(segment)) return false;
  return segment.includes("_");
}

function mergeTransform(existing: string, wanted: string[]): string {
  const parts = existing.split(",").filter(Boolean);
  const keys = new Set(parts.map((p) => p.split("_")[0]));
  const merged = [
    ...wanted.filter((p) => !keys.has(p.split("_")[0])),
    ...parts,
  ];
  return merged.join(",");
}

/**
 * Optimasi on-the-fly Cloudinary (f_auto,q_auto[,w_*,h_*,c_fill]).
 * URL non-Cloudinary (placeholder lokal) diteruskan apa adanya.
 */
export function cld(
  url: string | null | undefined,
  opts: CloudinaryOpts = {},
): string | null {
  if (!url) return null;
  const m = UPLOAD_RE.exec(url);
  if (!m) return url;
  const prefix = m[1];
  const rest = m[2];

  const wanted = ["f_auto", "q_auto"];
  if (opts.w) wanted.push(`w_${opts.w}`);
  if (opts.h) wanted.push(`h_${opts.h}`);
  if (opts.w && opts.h && opts.fill !== false) wanted.push("c_fill");

  const slash = rest.indexOf("/");
  const head = slash === -1 ? rest : rest.slice(0, slash);
  const tail = slash === -1 ? "" : rest.slice(slash + 1);

  if (isTransformationSegment(head)) {
    return `${prefix}${mergeTransform(head, wanted)}${tail ? "/" + tail : ""}`;
  }
  return `${prefix}${wanted.join(",")}/${rest}`;
}

/** Ambil public_id Cloudinary dari URL-nya (dipakai untuk hapus gambar lama). */
export function publicIdFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = UPLOAD_RE.exec(url);
  if (!m) return null;
  let rest = m[2];

  const slash = rest.indexOf("/");
  if (slash !== -1 && isTransformationSegment(rest.slice(0, slash))) {
    rest = rest.slice(slash + 1);
  }
  const versionMatch = /^(v\d+\/)(.*)$/.exec(rest);
  if (versionMatch) rest = versionMatch[2];

  const lastSlash = rest.lastIndexOf("/");
  const lastDot = rest.lastIndexOf(".");
  if (lastDot > lastSlash && lastDot !== -1) rest = rest.slice(0, lastDot);
  return rest || null;
}
