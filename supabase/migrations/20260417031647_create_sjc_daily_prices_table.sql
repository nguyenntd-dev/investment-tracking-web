create extension if not exists pgcrypto;

create table public.sjc_daily_prices (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  latest_day timestamptz not null
);

create index sjc_daily_prices_latest_day_idx
  on public.sjc_daily_prices (latest_day desc);

alter table public.sjc_daily_prices
add constraint sjc_daily_prices_latest_day_key unique (latest_day);
