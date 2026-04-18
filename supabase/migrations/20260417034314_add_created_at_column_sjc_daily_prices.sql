alter table if exists public.sjc_daily_prices
add created_at timestamptz default now();