alter table public.sjc_daily_prices
enable row level security;

create policy "authenticated can select sjc_daily_prices"
on public.sjc_daily_prices
for select
to authenticated
using (true);
