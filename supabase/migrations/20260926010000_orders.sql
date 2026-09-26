-- Valenca: orders (pesanan yang dibuat customer dari halaman /bayar/*)
create table if not exists public.orders (
  kode         text primary key,
  product_id   text not null,
  product_name text not null,
  item_label   text not null,
  target_label text not null default '',
  target_value text not null default '',
  price        integer not null default 0 check (price >= 0),
  admin_fee    integer not null default 0 check (admin_fee >= 0),
  total        integer not null default 0 check (total >= 0),
  status       text not null default 'pending'
               check (status in ('pending', 'paid', 'failed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS aktif tanpa policy publik: hanya service role (server) yang bisa baca/tulis.
-- Nomor HP / target pelanggan tidak boleh terbaca anon.
alter table public.orders enable row level security;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
