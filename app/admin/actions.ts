"use server";

import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ICON_NAMES } from "@/components/icons";
import { requireAdmin, sessionCookieName, sessionCookieOptions, createSessionToken } from "@/lib/admin-auth";
import { publicIdFromUrl } from "@/lib/cloudinary";
import { destroyImage } from "@/lib/cloudinary-server";
import { getImages, updateOrderStatus, removeOrder } from "@/lib/data";
import { supabaseAdmin } from "@/lib/supabase";
import type { AdminResult, OrderStatus, Product, SiteImages, SiteSettings } from "@/types";

function revalidateAll(): void {
  revalidatePath("/", "layout");
}

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "ADMIN_PASSWORD belum di-set di server." };

  const password = String(formData.get("password") ?? "");
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { error: "Password salah." };
  }

  const store = await cookies();
  store.set(sessionCookieName(), createSessionToken(), sessionCookieOptions());
  redirect("/admin/produk");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(sessionCookieName());
  redirect("/admin/login");
}

function validateProduct(product: Product): string | null {
  if (!product || typeof product.id !== "string" || !product.id.trim()) {
    return "ID produk wajib diisi.";
  }
  if (!product.nama?.trim()) return "Nama produk wajib diisi.";
  if (!(ICON_NAMES as string[]).includes(product.icon)) {
    return "Ikon tidak dikenal.";
  }
  if (!Number.isFinite(product.min) || product.min < 1) {
    return "Panjang input minimal 1.";
  }
  if (!Number.isFinite(product.admin) || product.admin < 0) {
    return "Biaya admin tidak valid.";
  }
  if (!Array.isArray(product.items) || product.items.length === 0) {
    return "Minimal satu item harga.";
  }
  for (const item of product.items) {
    if (!item.label?.trim()) return "Setiap item wajib punya nama.";
    if (!Number.isFinite(item.price) || item.price <= 0) {
      return `Harga "${item.label || "?"}" tidak valid.`;
    }
  }
  return null;
}

export async function saveProductAction(input: Product): Promise<AdminResult> {
  await requireAdmin();

  const invalid = validateProduct(input);
  if (invalid) return { ok: false, error: invalid };

  const id = input.id.trim().toLowerCase().replace(/\s+/g, "-");

  try {
    const db = supabaseAdmin();
    const { data: existing, error: readErr } = await db
      .from("products")
      .select("sort_order")
      .eq("id", id)
      .maybeSingle();
    if (readErr) throw readErr;

    let sortOrder = existing ? existing.sort_order : null;
    if (sortOrder === null || sortOrder === undefined) {
      const { data: maxRow } = await db
        .from("products")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      sortOrder = (maxRow?.sort_order ?? -1) + 1;
    }

    const row = {
      id,
      nama: input.nama.trim(),
      tag: (input.tag ?? "").trim(),
      icon: input.icon,
      input_label: (input.inputLabel ?? "").trim(),
      placeholder: (input.placeholder ?? "").trim(),
      hint: (input.hint ?? "").trim(),
      target_label: (input.targetLabel ?? "").trim(),
      min_len: Math.trunc(input.min),
      admin_fee: Math.trunc(input.admin),
      items: input.items.map((i) => ({
        label: i.label.trim(),
        sub: (i.sub ?? "").trim(),
        price: Math.trunc(i.price),
      })),
      sort_order: sortOrder,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await db.from("products").upsert(row, { onConflict: "id" });
    if (error) throw error;

    revalidateAll();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: `Gagal menyimpan produk: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export async function deleteProductAction(id: string): Promise<AdminResult> {
  await requireAdmin();
  if (!id?.trim()) return { ok: false, error: "ID produk tidak valid." };
  if (id === "pulsa") return { ok: false, error: "Produk pulsa tidak boleh dihapus." };

  try {
    const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
    if (error) throw error;
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: `Gagal menghapus: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

const IMAGE_KEYS = ["qris_url", "banner_utama", "banner_pln", "banner_data"] as const;function validateSettings(site: SiteSettings, images: SiteImages): string | null {
  if (!site || typeof site !== "object") return "Data pengaturan tidak valid.";
  if (!site.name?.trim()) return "Nama situs wajib diisi.";
  if (!site.url?.trim().match(/^https?:\/\//)) return "URL situs harus diawali http(s)://";
  if (!site.whatsapp?.trim()) return "Nomor WhatsApp wajib diisi.";
  if (!site.email?.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Email tidak valid.";
  for (const key of IMAGE_KEYS) {
    const value = images?.[key];
    if (value && !/^https:\/\/res\.cloudinary\.com\//.test(value)) {
      return `Gambar ${key} bukan URL Cloudinary yang valid.`;
    }
  }
  return null;
}

export async function saveSettingsAction(input: {
  site: SiteSettings;
  images: SiteImages;
}): Promise<AdminResult> {
  await requireAdmin();

  const invalid = validateSettings(input.site, input.images);
  if (invalid) return { ok: false, error: invalid };

  try {
    const db = supabaseAdmin();
    const now = new Date().toISOString();

    const { error: siteErr } = await db
      .from("site_settings")
      .upsert({ key: "site", value: input.site, updated_at: now }, { onConflict: "key" });
    if (siteErr) throw siteErr;

    const { error: imgErr } = await db
      .from("site_settings")
      .upsert(
        { key: "images", value: input.images, updated_at: now },
        { onConflict: "key" },
      );
    if (imgErr) throw imgErr;

    const previous = await getImages();
    for (const key of IMAGE_KEYS) {
      const before = previous[key];
      const after = input.images[key];
      if (before && before !== after && publicIdFromUrl(before)) {
        void destroyImage(before);
      }
    }

    revalidateAll();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: `Gagal menyimpan pengaturan: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "failed"];

export async function setOrderStatusAction(
  kode: string,
  status: OrderStatus,
): Promise<AdminResult> {
  await requireAdmin();
  if (!kode?.trim()) return { ok: false, error: "Kode pesanan tidak valid." };
  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Status pesanan tidak dikenal." };
  }

  try {
    await updateOrderStatus(kode.trim(), status);
    revalidatePath("/admin/pesanan");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: `Gagal mengubah status: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export async function deleteOrderAction(kode: string): Promise<AdminResult> {
  await requireAdmin();
  if (!kode?.trim()) return { ok: false, error: "Kode pesanan tidak valid." };

  try {
    await removeOrder(kode.trim());
    revalidatePath("/admin/pesanan");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: `Gagal menghapus pesanan: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
