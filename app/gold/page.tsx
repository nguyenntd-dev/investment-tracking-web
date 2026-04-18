import { ArrowUpRight, ChartNoAxesCombined, Clock3, Globe2, Landmark } from 'lucide-react';

import { GoldPriceHistory } from '@/components/gold-price-history';
import { getSjcDailyPrices } from '@/lib/supabase/sjc-daily-prices';

const fallbackGoldPrices = [
  { id: 1, branch: 'Hồ Chí Minh', type: 'SJC 1L, 10L, 1KG', buy: '118,500,000', sell: '120,500,000', spread: '2,000,000' },
  { id: 2, branch: 'Hồ Chí Minh', type: 'SJC 5 chỉ', buy: '118,450,000', sell: '120,450,000', spread: '2,000,000' },
  { id: 3, branch: 'Hồ Chí Minh', type: 'SJC 1 chỉ, 2 chỉ', buy: '118,380,000', sell: '120,380,000', spread: '2,000,000' },
  { id: 4, branch: 'Hồ Chí Minh', type: 'Nhẫn trơn 9999', buy: '114,200,000', sell: '116,800,000', spread: '2,600,000' },
  { id: 5, branch: 'Hồ Chí Minh', type: 'Nữ trang 99.99%', buy: '113,100,000', sell: '115,700,000', spread: '2,600,000' },
  { id: 6, branch: 'Hồ Chí Minh', type: 'Nữ trang 75%', buy: '82,400,000', sell: '89,400,000', spread: '7,000,000' },
];

const fxRates = [
  { symbol: 'USD', buy: '25,940', sell: '26,300' },
  { symbol: 'EUR', buy: '29,980', sell: '31,240' },
  { symbol: 'JPY', buy: '168.11', sell: '177.82' },
];

function formatSpread(buyValue: number, sellValue: number) {
  return new Intl.NumberFormat('en-US').format(Math.abs(sellValue - buyValue));
}

function formatMoneyValue(value: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

function formatLatestDate(latestDate: string | null, latestDay: string | null) {
  if (latestDate) {
    return `Last synced ${latestDate}.`;
  }

  if (!latestDay) {
    return 'Updated with the same reference window as the local gold board.';
  }

  const date = new Date(latestDay);

  if (Number.isNaN(date.getTime())) {
    return 'Updated with the same reference window as the local gold board.';
  }

  return `Last synced ${new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)}.`;
}

async function getGoldBoardRows() {
  try {
    const snapshot = await getSjcDailyPrices();

    if (!snapshot.entries.length) {
      return {
        prices: fallbackGoldPrices,
        updatedAtLabel: 'Updated with the same reference window as the local gold board.',
      };
    }

    const prices = snapshot.entries.map((entry) => ({
      id: entry.id,
      branch: entry.branch,
      type: entry.type,
      buy: formatMoneyValue(entry.buyValue),
      sell: formatMoneyValue(entry.sellValue),
      spread: formatSpread(entry.buyValue, entry.sellValue),
    }));

    return {
      prices,
      updatedAtLabel: formatLatestDate(snapshot.latestDate, snapshot.latestDay),
    };
  } catch {
    return {
      prices: fallbackGoldPrices,
      updatedAtLabel: 'Updated with the same reference window as the local gold board.',
    };
  }
}

export default async function GoldPage() {
  const { prices, updatedAtLabel } = await getGoldBoardRows();

  return (
    <section className="min-h-full px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)]">
          <section className="border-border/70 bg-white/88 min-w-0 rounded-[2rem] border px-5 py-5 shadow-[0_24px_65px_-42px_rgba(15,23,42,0.45)] backdrop-blur md:px-6 md:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[#9b6c12] flex items-center gap-2 text-sm font-medium">
                  <Landmark className="size-4" />
                  Vietnam market
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">SJC price table</h2>
              </div>
              <div className="bg-[#fff8eb] text-[#9b6c12] rounded-full px-3 py-1 text-xs font-medium">
                All branches
              </div>
            </div>

            <p className="text-muted-foreground mt-4 text-sm leading-6">
              Main retail references for physical gold products in the domestic market.
            </p>

            <div className="mt-5 rounded-[1.5rem] border border-[#d8c8a6]/80">
              <div className="max-h-[35rem] overflow-auto overscroll-contain rounded-[1.5rem] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cbb370] [&::-webkit-scrollbar-track]:bg-[#fff8eb] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2">
                <div className="min-w-[64rem]">
                  <div className="sticky top-0 z-10 bg-[#f4e6bd] grid grid-cols-[minmax(13rem,1.5fr)_minmax(7rem,0.8fr)_minmax(7rem,0.8fr)_minmax(7rem,0.8fr)_minmax(8rem,1.1fr)] gap-3 px-4 py-3 text-sm font-semibold">
                    <span>Type</span>
                    <span className="text-right">Buy</span>
                    <span className="text-right">Sell</span>
                    <span className="text-right">Spread</span>
                    <span className="text-right">Branch</span>
                  </div>
                  <div className="divide-y divide-[#eee4cf]">
                    {prices.map((item) => (
                      <div
                        key={item.id}
                        className="grid min-h-[3.5rem] grid-cols-[minmax(13rem,1.5fr)_minmax(7rem,0.8fr)_minmax(7rem,0.8fr)_minmax(7rem,0.8fr)_minmax(8rem,1.1fr)] items-center gap-3 px-4 py-3 text-sm transition odd:bg-white even:bg-[#fffaf0]"
                      >
                        <div className="pr-2 font-medium leading-6">{item.type}</div>
                        <div className="text-right font-semibold">{item.buy}</div>
                        <div className="text-right font-semibold text-[#0c6aa6]">{item.sell}</div>
                        <div className="text-right font-semibold text-[#9b6c12]">{item.spread}</div>
                        <div className="text-right font-medium leading-6 text-[#6b4a08]">{item.branch}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </section>

          <section className="flex min-w-0 flex-col gap-5">
            <div className="border-border/70 bg-white/88 rounded-[2rem] border px-5 py-5 shadow-[0_24px_65px_-42px_rgba(15,23,42,0.45)] backdrop-blur md:px-6 md:py-6">
              <div className="text-[#9b6c12] flex items-center gap-2 text-sm font-medium">
                <Globe2 className="size-4" />
                World market
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">TradingView spot gold</h2>

              <div className="mt-5 rounded-[1.75rem] border border-[#ece0c4] bg-[linear-gradient(180deg,#fffdfa,#fff4dc)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[#e2a500] text-white">
                      <Globe2 className="size-5" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold tracking-tight">XAUUSD</p>
                      <p className="text-muted-foreground text-sm">Gold / U.S. Dollar</p>
                    </div>
                  </div>
                  <div className="border-border/70 bg-white/90 rounded-full border px-3 py-1.5 text-xs font-semibold">
                    TradingView
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-5xl font-semibold tracking-tight">4,768.55</p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <ArrowUpRight className="size-4" />
                    +22.40 today
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border/70 bg-[#f4d98f] rounded-[2rem] border border-[#e2c16b] px-5 py-5 shadow-[0_24px_65px_-42px_rgba(128,87,17,0.45)] md:px-6 md:py-6">
              <div className="flex items-center gap-2 text-sm font-medium text-[#8c5f0c]">
                <ChartNoAxesCombined className="size-4" />
                FX support
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#17120d]">Reference FX rates</h2>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#f9e5ab]/80">
                <div className="grid grid-cols-3 gap-3 border-b border-[#e0c980] px-4 py-3 text-sm font-semibold text-[#17120d]">
                  <span>Code</span>
                  <span className="text-right">Buy</span>
                  <span className="text-right">Sell</span>
                </div>
                <div className="divide-y divide-[#ead8a0]">
                  {fxRates.map((row) => (
                    <div key={row.symbol} className="grid grid-cols-3 gap-3 px-4 py-3.5 text-sm">
                      <span className="font-semibold text-[#17120d]">{row.symbol}</span>
                      <span className="text-right font-medium text-[#17120d]">{row.buy}</span>
                      <span className="text-right font-medium text-[#17120d]">{row.sell}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#5f4512]">
                <Clock3 className="size-4" />
                {updatedAtLabel}
              </div>
            </div>
          </section>
        </div>

        <GoldPriceHistory />
      </div>
    </section>
  );
}
