alter table public.sjc_daily_prices
alter column latest_day type date
using ((latest_day at time zone 'Asia/Ho_Chi_Minh')::date);
