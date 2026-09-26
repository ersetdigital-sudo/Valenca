-- Valenca: perluasan lifecycle status pesanan
-- lama : pending | paid | failed
-- baru : pending | paid | processing | completed | failed | cancelled
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'paid', 'processing', 'completed', 'failed', 'cancelled'));
