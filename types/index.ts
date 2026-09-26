import type { IconName } from "@/components/icons";

export type ProductItem = {
  label: string;
  sub: string;
  price: number;
};

export type Product = {
  id: string;
  nama: string;
  tag: string;
  icon: IconName;
  inputLabel: string;
  placeholder: string;
  hint: string;
  targetLabel: string;
  min: number;
  admin: number;
  items: ProductItem[];
};

export type Faq = {
  q: string;
  a: string;
};

export type Testimonial = {
  initial: string;
  name: string;
  city: string;
  quote: string;
};

export type WhyItem = {
  value: string;
  title: string;
  desc: string;
};

export type StepItem = {
  title: string;
  desc: string;
};

export type LegalSection = {
  id: string;
  num: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  note?: string;
};

export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
  cta: {
    title: string;
    desc: string;
    href: string;
    label: string;
  };
};

/** Editable copy for the admin "Pengaturan situs" form (DB: site_settings.value.site). */
export type SiteSettings = {
  name: string;
  url: string;
  tagline: string;
  description: string;
  ogDescription: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  jamLayanan: string;
  legalUpdated: string;
};

/** Cloudinary-backed images (DB: site_settings.value.images). null = fall back to /public/banners or placeholder. */
export type SiteImages = {
  qris_url: string | null;
  banner_utama: string | null;
  banner_pln: string | null;
  banner_data: string | null;
};

export type AdminResult = { ok: true } | { ok: false; error: string };

/** Status verifikasi pembayaran sebuah pesanan (DB: public.orders.status). */
export type OrderStatus = "pending" | "paid" | "failed";

/** Pesanan yang dibuat customer saat checkout di halaman /bayar/*. */
export type Order = {
  kode: string;
  productId: string;
  productName: string;
  itemLabel: string;
  targetLabel: string;
  targetValue: string;
  price: number;
  adminFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
