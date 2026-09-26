// One-off: generates supabase/migrations/20260926000000_init.sql from data/*.ts
// Run: node scripts/gen-migration.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { products } = await import(`file://${resolve(root, "data/products.ts").replace(/\\/g, "/")}`);
const { site } = await import(`file://${resolve(root, "data/site.ts").replace(/\\/g, "/")}`);

const q = (s) => `'${String(s ?? "").replace(/'/g, "''")}'`;
const j = (v) => `'${JSON.stringify(v).replace(/'/g, "''")}'`;

const schema = `-- Valenca: initial schema (products + site settings)
create table if not exists public.products (
  id           text primary key,
  nama         text not null,
  tag          text not null default '',
  icon         text not null default 'pulsa',
  input_label  text not null default '',
  placeholder  text not null default '',
  hint         text not null default '',
  target_label text not null default '',
  min_len      integer not null default 9,
  admin_fee    integer not null default 0,
  items        jsonb not null default '[]'::jsonb,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  updated_at   timestamptz not null default now()
);

create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (true);

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
  for select using (true);
`;

const productRows = products
  .map(
    (p, i) =>
      `(${q(p.id)}, ${q(p.nama)}, ${q(p.tag)}, ${q(p.icon)}, ${q(p.inputLabel)}, ${q(p.placeholder)}, ${q(p.hint)}, ${q(p.targetLabel)}, ${Number(p.min)}, ${Number(p.admin)}, ${j(p.items)}, ${i}, true)`
  )
  .join(",\n  ");

const seedProducts = `
-- Seed: mirror of data/products.ts (authoritative copy lives in the DB from here on)
insert into public.products (id, nama, tag, icon, input_label, placeholder, hint, target_label, min_len, admin_fee, items, sort_order, is_active)
values
  ${productRows}
on conflict (id) do nothing;
`;

const settings = {
  site: {
    name: site.name,
    url: site.url,
    tagline: site.tagline,
    description: site.description,
    ogDescription: site.ogDescription,
    whatsapp: site.whatsapp,
    whatsappUrl: site.whatsappUrl,
    email: site.email,
    jamLayanan: site.jamLayanan,
    legalUpdated: site.legalUpdated,
  },
  images: { qris_url: null, banner_utama: null, banner_pln: null, banner_data: null },
};

const seedSettings = `
-- Seed: site settings (images start null -> public site falls back to /public/banners)
insert into public.site_settings (key, value)
values
  ('site', ${j(settings.site)}),
  ('images', ${j(settings.images)})
on conflict (key) do nothing;
`;

const sql = `${schema}${seedSettings}${seedProducts}`;
const out = resolve(root, "supabase/migrations/20260926000000_init.sql");
writeFileSync(out, sql, "utf8");
console.log(`written: ${out}`);
console.log(`products: ${products.length}, settings keys: ${Object.keys(settings).join(",")}`);
