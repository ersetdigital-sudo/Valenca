import { ICON_NAMES } from "@/components/icons";
import {
  products as staticProducts,
  getProduct as staticGetProduct,
} from "@/data/products";
import { site as staticSite } from "@/data/site";
import type { IconName } from "@/components/icons";
import type {
  Order,
  OrderStatus,
  Product,
  ProductItem,
  SiteImages,
  SiteSettings,
} from "@/types";
import { supabaseAdmin } from "@/lib/supabase";
import { waLinkFrom } from "@/lib/wa";
import { ORDER_STATUSES } from "@/types";

const PRODUCT_COLUMNS =
  "id,nama,tag,icon,input_label,placeholder,hint,target_label,min_len,admin_fee,items,sort_order,is_active";

type ProductRow = {
  id: string;
  nama: string;
  tag: string;
  icon: string;
  input_label: string;
  placeholder: string;
  hint: string;
  target_label: string;
  min_len: number;
  admin_fee: number;
  items: ProductItem[];
  sort_order: number;
  is_active: boolean;
};

type SettingRow = { key: string; value: Record<string, unknown> | null };

function safeIcon(icon: unknown): IconName {
  return (ICON_NAMES as string[]).includes(String(icon))
    ? (icon as IconName)
    : "pulsa";
}

function sanitizeItems(raw: unknown): ProductItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it): ProductItem | null => {
      if (!it || typeof it !== "object") return null;
      const o = it as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label : "";
      const price = Number(o.price);
      if (!label.trim() || !Number.isFinite(price) || price <= 0) return null;
      return {
        label: label.trim(),
        sub: typeof o.sub === "string" ? o.sub : "",
        price: Math.trunc(price),
      };
    })
    .filter((x): x is ProductItem => x !== null);
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    nama: row.nama,
    tag: row.tag,
    icon: safeIcon(row.icon),
    inputLabel: row.input_label,
    placeholder: row.placeholder,
    hint: row.hint,
    targetLabel: row.target_label,
    min: Number(row.min_len) || 0,
    admin: Number(row.admin_fee) || 0,
    items: sanitizeItems(row.items),
  };
}

/** DB-first, fallback ke data statis kalau Supabase tidak terjangkau. */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return staticProducts;
    return (data as ProductRow[]).map(toProduct);
  } catch (e) {
    console.error("[data] getProducts fallback:", e);
    return staticProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (data) return toProduct(data as ProductRow);
  } catch (e) {
    console.error("[data] getProduct fallback:", e);
  }
  return staticGetProduct(id) ?? null;
}

export const DEFAULT_SITE: SiteSettings = { ...staticSite };

const SITE_KEYS: (keyof SiteSettings)[] = [
  "name",
  "url",
  "tagline",
  "description",
  "ogDescription",
  "whatsapp",
  "whatsappUrl",
  "email",
  "jamLayanan",
  "legalUpdated",
];

export const DEFAULT_IMAGES: SiteImages = {
  qris_url: null,
  banner_utama: null,
  banner_pln: null,
  banner_data: null,
};

async function readSetting(key: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    const value = (data as SettingRow | null)?.value;
    return value && typeof value === "object" ? value : null;
  } catch (e) {
    console.error(`[data] readSetting(${key}) fallback:`, e);
    return null;
  }
}

function pickStrings<T extends Record<string, unknown>>(
  source: Record<string, unknown> | null,
  keys: readonly (keyof T & string)[],
  fallback: T,
): T {
  if (!source) return fallback;
  const out = { ...fallback };
  for (const k of keys) {
    const v = source[k];
    if (typeof v === "string" && v.trim()) {
      (out as Record<string, string>)[k] = v;
    }
  }
  return out;
}

export async function getSite(): Promise<SiteSettings> {
  const value = await readSetting("site");
  const site = pickStrings(value, SITE_KEYS, DEFAULT_SITE);
  return { ...site, whatsappUrl: waLinkFrom(site.whatsapp, site.whatsappUrl) };
}

export async function getImages(): Promise<SiteImages> {
  const value = await readSetting("images");
  return pickStrings(
    value,
    Object.keys(DEFAULT_IMAGES) as (keyof SiteImages)[],
    DEFAULT_IMAGES,
  );
}

export type AllSettings = { site: SiteSettings; images: SiteImages };

export async function getAllSettings(): Promise<AllSettings> {
  const [site, images] = await Promise.all([getSite(), getImages()]);
  return { site, images };
}

const ORDER_COLUMNS =
  "kode,product_id,product_name,item_label,target_label,target_value,price,admin_fee,total,status,created_at";

type OrderRow = {
  kode: string;
  product_id: string;
  product_name: string;
  item_label: string;
  target_label: string;
  target_value: string;
  price: number;
  admin_fee: number;
  total: number;
  status: string;
  created_at: string;
};

function toOrder(row: OrderRow): Order {
  return {
    kode: row.kode,
    productId: row.product_id,
    productName: row.product_name,
    itemLabel: row.item_label,
    targetLabel: row.target_label,
    targetValue: row.target_value,
    price: Number(row.price) || 0,
    adminFee: Number(row.admin_fee) || 0,
    total: Number(row.total) || 0,
    status: (ORDER_STATUSES as string[]).includes(row.status)
      ? (row.status as OrderStatus)
      : "pending",
    createdAt: row.created_at,
  };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("orders")
      .select(ORDER_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data as OrderRow[]).map(toOrder);
  } catch (e) {
    console.error("[data] getOrders:", e);
    return [];
  }
}

export type NewOrder = Omit<Order, "status" | "createdAt">;

export async function insertOrder(input: NewOrder): Promise<void> {
  await supabaseAdmin()
    .from("orders")
    .insert({
      kode: input.kode,
      product_id: input.productId,
      product_name: input.productName,
      item_label: input.itemLabel,
      target_label: input.targetLabel,
      target_value: input.targetValue,
      price: input.price,
      admin_fee: input.adminFee,
      total: input.total,
      status: "pending",
    });
}

export async function updateOrderStatus(
  kode: string,
  status: OrderStatus,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("kode", kode);
  if (error) throw error;
}

export async function removeOrder(kode: string): Promise<void> {
  const { error } = await supabaseAdmin().from("orders").delete().eq("kode", kode);
  if (error) throw error;
}

/** Lookup satu pesanan lewat kode (untuk fitur cek transaksi publik). Throw kalau DB error; null = tidak ditemukan. */
export async function getOrderByKode(kode: string): Promise<Order | null> {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("kode", kode)
    .maybeSingle();
  if (error) throw error;
  return data ? toOrder(data as OrderRow) : null;
}
