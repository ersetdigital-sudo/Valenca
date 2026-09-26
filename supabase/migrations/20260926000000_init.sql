-- Valenca: initial schema (products + site settings)
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

-- Seed: site settings (images start null -> public site falls back to /public/banners)
insert into public.site_settings (key, value)
values
  ('site', '{"name":"Valenca","url":"https://valenca.id","tagline":"Bayar Cepat, Hidup Lebih Ringan","description":"Valenca — layanan PPOB terpercaya untuk pulsa, token PLN, paket data, PDAM, BPJS, internet, e-money, dan multifinance. Bayar cepat via QRIS tanpa perlu akun.","ogDescription":"Bayar tagihan & isi ulang dalam hitungan detik. Pulsa, PLN, Paket Data, PDAM, BPJS, Internet, E-Money, Multifinance.","whatsapp":"0812-0000-0000","whatsappUrl":"https://wa.me/6281200000000","email":"halo@valenca.id","jamLayanan":"24 jam setiap hari","legalUpdated":"24 September 2026"}'),
  ('images', '{"qris_url":null,"banner_utama":null,"banner_pln":null,"banner_data":null}')
on conflict (key) do nothing;

-- Seed: mirror of data/products.ts (authoritative copy lives in the DB from here on)
insert into public.products (id, nama, tag, icon, input_label, placeholder, hint, target_label, min_len, admin_fee, items, sort_order, is_active)
values
  ('pulsa', 'Pulsa', 'Telkomsel, XL, Indosat, Tri', 'pulsa', 'Nomor Handphone', '08xx xxxx xxxx', 'Pastikan nomor aktif.', 'Nomor HP', 9, 0, '[{"label":"Pulsa 5.000","sub":"Masa aktif +7 hari","price":6500},{"label":"Pulsa 10.000","sub":"Masa aktif +14 hari","price":11500},{"label":"Pulsa 15.000","sub":"Masa aktif +21 hari","price":16500},{"label":"Pulsa 20.000","sub":"Masa aktif +30 hari","price":21000},{"label":"Pulsa 25.000","sub":"Masa aktif +30 hari","price":26000},{"label":"Pulsa 50.000","sub":"Masa aktif +45 hari","price":50500},{"label":"Pulsa 100.000","sub":"Masa aktif +60 hari","price":99500},{"label":"Pulsa 200.000","sub":"Masa aktif +90 hari","price":198000}]', 0, true),
  ('pln', 'PLN / Listrik', 'Token & Pascabayar', 'pln', 'Nomor Meter / ID Pelanggan', '11 atau 12 digit', 'Cek di meteran atau struk.', 'ID Pelanggan', 10, 2500, '[{"label":"Token 20.000","sub":"±14,2 kWh","price":20000},{"label":"Token 50.000","sub":"±35,7 kWh","price":50000},{"label":"Token 100.000","sub":"±72,4 kWh","price":100000},{"label":"Token 200.000","sub":"±145,3 kWh","price":200000},{"label":"Token 500.000","sub":"±363,6 kWh","price":500000},{"label":"Token 1.000.000","sub":"±727,2 kWh","price":1000000},{"label":"Tagihan Pascabayar","sub":"Periode berjalan","price":247500}]', 1, true),
  ('data', 'Paket Data', 'Semua Operator', 'data', 'Nomor Handphone', '08xx xxxx xxxx', 'Paket aktif otomatis maks 5 menit.', 'Nomor HP', 9, 1000, '[{"label":"1 GB / 3 Hari","sub":"Kuota 24 jam","price":9000},{"label":"3 GB / 7 Hari","sub":"Kuota 24 jam","price":20000},{"label":"5 GB / 30 Hari","sub":"Kuota 24 jam","price":35000},{"label":"10 GB / 30 Hari","sub":"Kuota utama + malam","price":55000},{"label":"20 GB / 30 Hari","sub":"Kuota 24 jam","price":85000},{"label":"50 GB / 30 Hari","sub":"Kuota 24 jam","price":135000},{"label":"Unlimited / 30 Hari","sub":"FUP 2 GB/hari","price":99000}]', 2, true),
  ('emoney', 'E-Money / E-Wallet', 'GoPay, OVO, DANA, dll', 'emoney', 'Nomor HP / Nomor Kartu', '08xx atau 16 digit', 'Untuk e-Toll, masukkan 16 digit.', 'Nomor Akun', 9, 1500, '[{"label":"Top Up 20.000","sub":"Saldo instan","price":20000},{"label":"Top Up 50.000","sub":"Saldo instan","price":50000},{"label":"Top Up 100.000","sub":"Saldo instan","price":100000},{"label":"Top Up 200.000","sub":"Saldo instan","price":200000},{"label":"Top Up 300.000","sub":"Saldo instan","price":300000},{"label":"Top Up 500.000","sub":"Saldo instan","price":500000},{"label":"Top Up 1.000.000","sub":"Saldo instan","price":1000000}]', 3, true),
  ('bpjs', 'BPJS Kesehatan', 'Iuran Bulanan', 'bpjs', 'Nomor Kartu / VA BPJS', '13 digit', 'Pakai nomor kepala keluarga.', 'Nomor BPJS', 11, 2500, '[{"label":"Kelas 1 — 1 Bulan","sub":"Rp150.000/jiwa","price":150000},{"label":"Kelas 2 — 1 Bulan","sub":"Rp100.000/jiwa","price":100000},{"label":"Kelas 3 — 1 Bulan","sub":"Rp35.000/jiwa","price":35000},{"label":"Kelas 1 — 3 Bulan","sub":"Bayar sekaligus","price":450000},{"label":"Kelas 2 — 3 Bulan","sub":"Bayar sekaligus","price":300000},{"label":"Kelas 3 — 3 Bulan","sub":"Bayar sekaligus","price":105000}]', 4, true),
  ('pdam', 'PDAM / Air', '300+ Wilayah', 'pdam', 'ID Pelanggan PDAM', 'Masukkan ID', 'Lihat di lembar tagihan bulanan.', 'ID Pelanggan', 6, 2500, '[{"label":"Tagihan Bulan Ini","sub":"Periode terbaru","price":112400},{"label":"Tunggakan 1 Bulan","sub":"1 periode","price":118900},{"label":"Tunggakan 2 Bulan","sub":"2 periode","price":231300},{"label":"Tunggakan 3 Bulan","sub":"3 periode","price":346800}]', 5, true),
  ('internet', 'Internet & TV', 'IndiHome, Biznet, dll', 'internet', 'Nomor Pelanggan', 'Masukkan nomor', 'Untuk IndiHome: 12 digit.', 'No. Pelanggan', 6, 3000, '[{"label":"Paket 30 Mbps","sub":"Tagihan berjalan","price":315000},{"label":"Paket 50 Mbps","sub":"Tagihan berjalan","price":385000},{"label":"Paket 100 Mbps","sub":"Tagihan berjalan","price":535000},{"label":"Internet + TV","sub":"Tagihan berjalan","price":445000},{"label":"Tunggakan 2 Bulan","sub":"2 periode","price":770000}]', 6, true),
  ('finance', 'Multifinance', 'FIF, Adira, BAF, dll', 'finance', 'Nomor Kontrak', 'Masukkan nomor kontrak', 'Lihat di buku angsuran.', 'No. Kontrak', 6, 5000, '[{"label":"Angsuran Motor","sub":"1 periode","price":785000},{"label":"Angsuran Mobil","sub":"1 periode","price":3250000},{"label":"Angsuran Elektronik","sub":"1 periode","price":465000},{"label":"Pinjaman Multiguna","sub":"1 periode","price":1150000},{"label":"Tunggakan + Denda","sub":"2 periode","price":1620000}]', 7, true)
on conflict (id) do nothing;
